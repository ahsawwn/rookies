"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { cart, cartItem, product } from "@/db/schema";
import { randomBytes } from "crypto";

function generateId(): string {
    return randomBytes(16).toString("hex");
}

export interface CartItemInput {
    productId: string;
    quantity: number;
}

/**
 * Get or create cart for user
 */
async function getOrCreateCart(userId?: string, sessionId?: string) {
    let cartRecord;

    if (userId) {
        cartRecord = await db.query.cart.findFirst({
            where: eq(cart.userId, userId),
        });
    } else if (sessionId) {
        cartRecord = await db.query.cart.findFirst({
            where: eq(cart.sessionId, sessionId),
        });
    }

    if (!cartRecord) {
        const newCartId = generateId();
        await db.insert(cart).values({
            id: newCartId,
            userId: userId || null,
            sessionId: sessionId || null,
        });
        cartRecord = await db.query.cart.findFirst({
            where: eq(cart.id, newCartId),
        });
    }

    return cartRecord;
}

/**
 * Sync cart to database
 */
export async function syncCartToDatabase(
    items: CartItemInput[],
    userId?: string,
    sessionId?: string
) {
    try {
        if (!userId && !sessionId) {
            return {
                success: false,
                error: "User ID or session ID required",
            };
        }

        const cartRecord = await getOrCreateCart(userId, sessionId);
        if (!cartRecord) {
            return {
                success: false,
                error: "Failed to create cart",
            };
        }

        // Delete existing items
        await db.delete(cartItem).where(eq(cartItem.cartId, cartRecord.id));

        // Insert new items
        if (items.length > 0) {
            await db.insert(cartItem).values(
                items.map((item) => ({
                    id: generateId(),
                    cartId: cartRecord.id,
                    productId: item.productId,
                    quantity: item.quantity,
                }))
            );
        }

        // Update cart timestamp
        await db
            .update(cart)
            .set({ updatedAt: new Date() })
            .where(eq(cart.id, cartRecord.id));

        return {
            success: true,
            cartId: cartRecord.id,
        };
    } catch (error) {
        console.error("Sync cart to database error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to sync cart",
        };
    }
}

/**
 * Get cart from database
 */
export async function getCartFromDatabase(userId?: string, sessionId?: string) {
    try {
        let cartRecord;

        if (userId) {
            cartRecord = await db.query.cart.findFirst({
                where: eq(cart.userId, userId),
                with: {
                    items: {
                        with: {
                            product: true,
                        },
                    },
                },
            });
        } else if (sessionId) {
            cartRecord = await db.query.cart.findFirst({
                where: eq(cart.sessionId, sessionId),
                with: {
                    items: {
                        with: {
                            product: true,
                        },
                    },
                },
            });
        }

        if (!cartRecord) {
            return {
                success: true,
                items: [],
            };
        }

        const items = cartRecord.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            product: item.product,
        }));

        return {
            success: true,
            items,
        };
    } catch (error) {
        console.error("Get cart from database error:", error);
        const e = error as Error;
        return {
            success: false,
            items: [],
            error: e.message || "Failed to get cart",
        };
    }
}

/**
 * Clear cart from database
 */
export async function clearCartFromDatabase(userId?: string, sessionId?: string) {
    try {
        let cartRecord;

        if (userId) {
            cartRecord = await db.query.cart.findFirst({
                where: eq(cart.userId, userId),
            });
        } else if (sessionId) {
            cartRecord = await db.query.cart.findFirst({
                where: eq(cart.sessionId, sessionId),
            });
        }

        if (cartRecord) {
            await db.delete(cartItem).where(eq(cartItem.cartId, cartRecord.id));
            await db.delete(cart).where(eq(cart.id, cartRecord.id));
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Clear cart from database error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to clear cart",
        };
    }
}

/**
 * Merge carts when user logs in
 */
export async function mergeCarts(
    sessionCartItems: CartItemInput[],
    userId: string
) {
    try {
        // Get user's existing cart
        const userCartResult = await getCartFromDatabase(userId);
        const userCartItems = userCartResult.items || [];

        // Merge items: combine quantities for same products
        const mergedItems = new Map<string, number>();

        // Add session cart items
        sessionCartItems.forEach((item) => {
            mergedItems.set(item.productId, item.quantity);
        });

        // Add user cart items (merge quantities)
        userCartItems.forEach((item: any) => {
            const existing = mergedItems.get(item.productId) || 0;
            mergedItems.set(item.productId, existing + item.quantity);
        });

        // Convert to array
        const finalItems: CartItemInput[] = Array.from(mergedItems.entries()).map(
            ([productId, quantity]) => ({
                productId,
                quantity,
            })
        );

        // Sync merged cart
        const result = await syncCartToDatabase(finalItems, userId);

        return result;
    } catch (error) {
        console.error("Merge carts error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to merge carts",
        };
    }
}

