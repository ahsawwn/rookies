"use server";

import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { order, orderItem, product } from "@/db/schema";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";

function generateId(): string {
    return randomBytes(16).toString("hex");
}

function generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

export interface CreateOrderInput {
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    deliveryType: "delivery" | "pickup";
    deliveryAddress?: any;
    pickupBranchId?: string;
    pickupName?: string;
    pickupPhone?: string;
}

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a new order
 */
export async function createOrder(input: CreateOrderInput) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return {
                success: false,
                error: "You must be logged in to place an order",
            };
        }

        // Validate stock availability
        for (const item of input.items) {
            const productRecord = await db.query.product.findFirst({
                where: eq(product.id, item.productId),
            });

            if (!productRecord) {
                return {
                    success: false,
                    error: `Product ${item.productId} not found`,
                };
            }

            if (productRecord.stock < item.quantity) {
                return {
                    success: false,
                    error: `Insufficient stock for ${productRecord.name}. Only ${productRecord.stock} available.`,
                };
            }
        }

        // Create order
        const orderId = generateId();
        const orderNumber = generateOrderNumber();
        
        // Generate verification code for pickup orders
        const verificationCode = input.deliveryType === "pickup" ? generateVerificationCode() : null;

        await db.insert(order).values({
            id: orderId,
            userId: session.user.id,
            orderNumber,
            totalAmount: input.totalAmount.toString(),
            status: "pending",
            paymentMethod: input.paymentMethod,
            paymentStatus: "pending",
            deliveryType: input.deliveryType,
            deliveryAddress: input.deliveryAddress || null,
            pickupBranchId: input.pickupBranchId || null,
            pickupVerificationCode: verificationCode,
            pickupName: input.pickupName || null,
            pickupPhone: input.pickupPhone || null,
        });

        // Create order items and update stock
        for (const item of input.items) {
            const productRecord = await db.query.product.findFirst({
                where: eq(product.id, item.productId),
            });

            if (!productRecord) continue;

            await db.insert(orderItem).values({
                id: generateId(),
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: productRecord.price,
            });

            // Update stock
            await db
                .update(product)
                .set({ stock: productRecord.stock - item.quantity })
                .where(eq(product.id, item.productId));
        }

        // Send order confirmation email (async, don't block order creation)
        (async () => {
            try {
                const { sendOrderConfirmationEmail } = await import("@/server/email");
                
                // Fetch order items with product details
                const orderItems = await Promise.all(
                    input.items.map(async (item) => {
                        const productRecord = await db.query.product.findFirst({
                            where: eq(product.id, item.productId),
                        });
                        return {
                            product: productRecord,
                            quantity: item.quantity,
                            priceAtTime: productRecord?.price || "0",
                        };
                    })
                );

                const orderData = {
                    orderNumber,
                    totalAmount: input.totalAmount.toString(),
                    deliveryType: input.deliveryType,
                    deliveryAddress: input.deliveryAddress || undefined,
                    pickupName: input.pickupName || undefined,
                    pickupPhone: input.pickupPhone || undefined,
                    pickupVerificationCode: verificationCode || undefined,
                    paymentMethod: input.paymentMethod,
                    paymentStatus: "pending",
                    status: "pending",
                    items: orderItems,
                    createdAt: new Date(),
                };
                
                await sendOrderConfirmationEmail(
                    orderData as any,
                    session.user.email || "",
                    session.user.name || null
                );
            } catch (emailError) {
                // Don't fail the order if email fails
                console.error("Failed to send order confirmation email:", emailError);
            }
        })();

        return {
            success: true,
            orderId,
            orderNumber,
            verificationCode: verificationCode || undefined,
        };
    } catch (error) {
        console.error("Create order error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create order",
        };
    }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: "pending" | "processing" | "completed" | "cancelled") {
    try {
        await db
            .update(order)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(order.id, orderId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update order status error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to update order status",
        };
    }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
    try {
        const orderRecord = await db.query.order.findFirst({
            where: eq(order.orderNumber, orderNumber),
            with: {
                user: true,
                items: {
                    with: {
                        product: true,
                    },
                },
            },
        });

        if (!orderRecord) {
            return {
                success: false,
                order: null,
                error: "Order not found",
            };
        }

        return {
            success: true,
            order: orderRecord,
        };
    } catch (error) {
        console.error("Get order by number error:", error);
        const e = error as Error;
        return {
            success: false,
            order: null,
            error: e.message || "Failed to fetch order",
        };
    }
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders() {
    try {
        const orders = await db.query.order.findMany({
            orderBy: [desc(order.createdAt)],
            with: {
                user: true,
                items: {
                    with: {
                        product: true,
                    },
                },
            },
        });

        return {
            success: true,
            orders,
        };
    } catch (error) {
        console.error("Get all orders error:", error);
        const e = error as Error;
        return {
            success: false,
            orders: [],
            error: e.message || "Failed to fetch orders",
        };
    }
}

