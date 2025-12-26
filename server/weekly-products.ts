"use server";

import { db } from "@/db/drizzle";
import { product, weeklyProduct } from "@/db/schema";
import { and, gte, lte, eq } from "drizzle-orm";

/**
 * Get current week's products
 */
export async function getWeeklyProducts() {
    try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999);

        // Get products that are active for this week
        const weeklyProductsData = await db
            .select()
            .from(weeklyProduct)
            .where(
                and(
                    lte(weeklyProduct.startDate, endOfWeek),
                    gte(weeklyProduct.endDate, startOfWeek)
                )
            );

        if (weeklyProductsData.length === 0) {
            // Fallback: Get products with weekly dates set
            // Note: isVisible might not exist in older schemas, so we'll check isActive only
            const productsWithWeeklyDates = await db
                .select()
                .from(product)
                .where(
                    and(
                        eq(product.isActive, true),
                        lte(product.weeklyStartDate, endOfWeek),
                        gte(product.weeklyEndDate, startOfWeek)
                    )
                )
                .limit(12);

            return {
                success: true,
                products: productsWithWeeklyDates,
                weekRange: {
                    start: startOfWeek,
                    end: endOfWeek,
                },
            };
        }

        // Get the actual products
        const productIds = weeklyProductsData.map((wp) => wp.productId);
        const products = await db
            .select()
            .from(product)
            .where(eq(product.isActive, true))
            .limit(100); // Get all and filter

        const filteredProducts = products.filter((p) => productIds.includes(p.id));

        return {
            success: true,
            products: filteredProducts,
            weekRange: {
                start: startOfWeek,
                end: endOfWeek,
            },
        };
    } catch (error) {
        console.error("Get weekly products error:", error);
        const e = error as Error;
        return {
            success: false,
            products: [],
            error: e.message || "Failed to fetch weekly products.",
        };
    }
}

/**
 * Get all weekly product schedules
 */
export async function getAllWeeklyProducts() {
    try {
        const weeklyProductsData = await db
            .select()
            .from(weeklyProduct)
            .orderBy(weeklyProduct.startDate);

        // Get products for each weekly product
        const productIds = weeklyProductsData.map((wp) => wp.productId);
        const products = await db
            .select()
            .from(product)
            .where(eq(product.isActive, true))
            .limit(1000);

        const productMap = new Map(products.map((p) => [p.id, p]));

        const weeklyProductsWithDetails = weeklyProductsData.map((wp) => ({
            ...wp,
            product: productMap.get(wp.productId),
        }));

        return {
            success: true,
            weeklyProducts: weeklyProductsWithDetails,
        };
    } catch (error) {
        console.error("Get all weekly products error:", error);
        const e = error as Error;
        return {
            success: false,
            weeklyProducts: [],
            error: e.message || "Failed to fetch weekly products.",
        };
    }
}

/**
 * Create a weekly product schedule
 */
export async function createWeeklyProduct(input: {
    productId: string;
    startDate: Date;
    endDate: Date;
    adminId: string;
}) {
    try {
        const id = `weekly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(weeklyProduct).values({
            id,
            productId: input.productId,
            startDate: input.startDate,
            endDate: input.endDate,
            adminId: input.adminId,
        });

        return {
            success: true,
            id,
        };
    } catch (error) {
        console.error("Create weekly product error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create weekly product.",
        };
    }
}

/**
 * Delete a weekly product schedule
 */
export async function deleteWeeklyProduct(id: string) {
    try {
        await db.delete(weeklyProduct).where(eq(weeklyProduct.id, id));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Delete weekly product error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to delete weekly product.",
        };
    }
}

