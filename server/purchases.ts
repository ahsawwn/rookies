"use server";

import { eq, desc, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { purchaseOrder, purchaseOrderItem, supplier, product } from "@/db/schema";
import { getCurrentAdmin } from "./admin";
import { randomBytes } from "crypto";

function generateId(): string {
    return randomBytes(16).toString("hex");
}

function generateOrderNumber(): string {
    return `PO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

const createPurchaseOrderSchema = z.object({
    supplierId: z.string().min(1, "Supplier is required"),
    items: z.array(z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitCost: z.string().regex(/^\d+(\.\d{1,2})?$/, "Unit cost must be a valid number"),
    })).min(1, "At least one item is required"),
});

/**
 * Get all purchase orders
 */
export async function getAllPurchaseOrders() {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const orders = await db.query.purchaseOrder.findMany({
            orderBy: (purchaseOrder, { desc }) => [desc(purchaseOrder.createdAt)],
            with: {
                supplier: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    with: {
                        product: {
                            columns: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            success: true,
            orders,
        };
    } catch (error) {
        console.error("Get purchase orders error:", error);
        const e = error as Error;
        return {
            success: false,
            orders: [],
            error: e.message || "Failed to fetch purchase orders",
        };
    }
}

/**
 * Get all suppliers
 */
export async function getAllSuppliers() {
    try {
        const suppliers = await db.query.supplier.findMany({
            orderBy: (supplier, { asc }) => [asc(supplier.name)],
        });

        return {
            success: true,
            suppliers,
        };
    } catch (error) {
        console.error("Get suppliers error:", error);
        return {
            success: false,
            suppliers: [],
            error: "Failed to fetch suppliers",
        };
    }
}

/**
 * Create a new purchase order
 */
export async function createPurchaseOrder(data: {
    supplierId: string;
    items: Array<{
        productId: string;
        quantity: number;
        unitCost: string;
    }>;
}) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const validatedData = createPurchaseOrderSchema.parse(data);

        // Calculate total amount
        const totalAmount = validatedData.items.reduce((sum, item) => {
            return sum + (parseFloat(item.unitCost) * item.quantity);
        }, 0);

        const orderId = generateId();
        const orderNumber = generateOrderNumber();

        // Create purchase order
        await db.insert(purchaseOrder).values({
            id: orderId,
            orderNumber,
            supplierId: validatedData.supplierId,
            totalAmount: totalAmount.toString(),
            status: "pending",
            adminId: admin.id,
        });

        // Create purchase order items
        for (const item of validatedData.items) {
            const itemId = generateId();
            const subtotal = parseFloat(item.unitCost) * item.quantity;

            await db.insert(purchaseOrderItem).values({
                id: itemId,
                purchaseOrderId: orderId,
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
                subtotal: subtotal.toString(),
            });
        }

        return {
            success: true,
            orderId,
            orderNumber,
        };
    } catch (error) {
        console.error("Create purchase order error:", error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            };
        }
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create purchase order",
        };
    }
}

/**
 * Update purchase order status
 */
export async function updatePurchaseOrderStatus(orderId: string, status: "pending" | "received" | "cancelled") {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        await db
            .update(purchaseOrder)
            .set({ status })
            .where(eq(purchaseOrder.id, orderId));

        // If status is "received", update product stock
        if (status === "received") {
            const order = await db.query.purchaseOrder.findFirst({
                where: (purchaseOrder, { eq }) => eq(purchaseOrder.id, orderId),
                with: {
                    items: true,
                },
            });

            if (order) {
                for (const item of order.items) {
                    const productRecord = await db.query.product.findFirst({
                        where: eq(product.id, item.productId),
                    });

                    if (productRecord) {
                        const newStock = productRecord.stock + item.quantity;
                        await db
                            .update(product)
                            .set({ stock: newStock })
                            .where(eq(product.id, item.productId));
                    }
                }
            }
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update purchase order status error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to update purchase order status",
        };
    }
}

