"use server";

import { eq, desc, sql } from "drizzle-orm";
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
    // Guest order fields
    guestEmail?: string;
    guestName?: string;
    guestPhone?: string;
    guestSessionId?: string;
    guestIpAddress?: string;
}

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get client IP address from request headers
 */
function getClientIp(headers: Headers): string {
    // Check various headers for IP address
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    return "unknown";
}

/**
 * Create a new order (supports both authenticated and guest orders)
 */
export async function createOrder(input: CreateOrderInput) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const isGuestOrder = !session?.user;
        
        // For guest orders, require contact information
        if (isGuestOrder) {
            if (!input.guestEmail || !input.guestName || !input.guestPhone) {
                return {
                    success: false,
                    error: "Please provide your name, email, and phone number to place an order",
                };
            }
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

        // Get client IP for guest orders
        const requestHeaders = await headers();
        const clientIp = isGuestOrder ? getClientIp(requestHeaders) : null;

        await db.insert(order).values({
            id: orderId,
            userId: session?.user?.id || null, // Null for guest orders
            orderNumber,
            totalAmount: input.totalAmount.toString(),
            status: "pending",
            paymentMethod: input.paymentMethod,
            paymentStatus: "pending",
            deliveryType: input.deliveryType,
            deliveryAddress: input.deliveryAddress || null,
            pickupBranchId: input.pickupBranchId || null,
            pickupVerificationCode: verificationCode,
            pickupName: input.pickupName || input.guestName || null,
            pickupPhone: input.pickupPhone || input.guestPhone || null,
            // Guest order fields
            guestSessionId: input.guestSessionId || null,
            guestIpAddress: clientIp,
            guestEmail: input.guestEmail || null,
            guestName: input.guestName || null,
            guestPhone: input.guestPhone || null,
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
        // For guest orders, use guest email; for authenticated orders, use user email
        const emailToSend = isGuestOrder ? input.guestEmail : session?.user?.email;
        const userName = isGuestOrder ? input.guestName : session?.user?.name;
        
        if (emailToSend) {
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
                    emailToSend || "",
                    userName || null
                );
            } catch (emailError) {
                // Don't fail the order if email fails
                console.error("Failed to send order confirmation email:", emailError);
            }
        })();
        }

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
 * Get all orders (for admin) with pagination
 */
export async function getAllOrders(page: number = 1, limit: number = 20) {
    try {
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.warn("DATABASE_URL not set, returning empty orders");
            return {
                success: false,
                orders: [],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                },
                error: "Database not configured",
            };
        }

        // Validate pagination params
        const pageNum = Math.max(1, Math.floor(page));
        const limitNum = Math.max(1, Math.min(100, Math.floor(limit))); // Max 100 items per page
        const offset = (pageNum - 1) * limitNum;

        const [orders, totalCount] = await Promise.all([
            db.query.order.findMany({
                orderBy: [desc(order.createdAt)],
                limit: limitNum,
                offset: offset,
                with: {
                    user: {
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    items: {
                        limit: 10, // Limit items per order for performance
                        with: {
                            product: {
                                columns: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
            }),
            db.select({ count: sql<number>`count(*)` }).from(order),
        ]);

        const total = Number(totalCount[0]?.count || 0);
        const totalPages = Math.ceil(total / limitNum);

        return {
            success: true,
            orders,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1,
            },
        };
    } catch (error) {
        console.error("Get all orders error:", error);
        const e = error as Error;
        return {
            success: false,
            orders: [],
            pagination: {
                page: 1,
                limit: 20,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false,
            },
            error: e.message || "Failed to fetch orders",
        };
    }
}

