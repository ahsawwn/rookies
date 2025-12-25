"use server";

import { eq, and, or, like, desc, asc, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";

export interface ProductFilters {
    category?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
    featured?: boolean;
    page?: number;
    limit?: number;
}

/**
 * Get all active products with optional filters
 */
export async function getProducts(filters?: ProductFilters) {
    try {
        let query = db.select().from(product).where(eq(product.isActive, true));

        const conditions = [eq(product.isActive, true)];

        if (filters?.category && filters.category !== "all") {
            conditions.push(eq(product.category, filters.category));
        }

        if (filters?.featured) {
            conditions.push(eq(product.isFeatured, true));
        }

        if (filters?.search) {
            conditions.push(
                or(
                    like(product.name, `%${filters.search}%`),
                    like(product.description || "", `%${filters.search}%`),
                    like(product.shortDescription || "", `%${filters.search}%`)
                )!
            );
        }

        // Pagination
        const pageNum = filters?.page ? Math.max(1, Math.floor(filters.page)) : 1;
        const limitNum = filters?.limit ? Math.max(1, Math.min(100, Math.floor(filters.limit))) : 50;
        const offset = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const [totalCountResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(product)
            .where(and(...conditions));

        const total = Number(totalCountResult?.count || 0);

        // Build query with sorting
        let orderByClause;
        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case "price-asc":
                    orderByClause = asc(sql`CAST(${product.price} AS DECIMAL)`);
                    break;
                case "price-desc":
                    orderByClause = desc(sql`CAST(${product.price} AS DECIMAL)`);
                    break;
                case "name-asc":
                    orderByClause = asc(product.name);
                    break;
                case "name-desc":
                    orderByClause = desc(product.name);
                    break;
                case "newest":
                default:
                    orderByClause = desc(product.createdAt);
                    break;
            }
        } else {
            orderByClause = desc(product.createdAt);
        }

        const products = await db
            .select()
            .from(product)
            .where(and(...conditions))
            .orderBy(orderByClause)
            .limit(limitNum)
            .offset(offset);

        const totalPages = Math.ceil(total / limitNum);

        return {
            success: true,
            products,
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
        console.error("Get products error:", error);
        const e = error as Error;
        return {
            success: false,
            products: [],
            error: e.message || "Failed to fetch products.",
        };
    }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string) {
    try {
        const productRecord = await db.query.product.findFirst({
            where: and(eq(product.slug, slug), eq(product.isActive, true)),
        });

        if (!productRecord) {
            return {
                success: false,
                product: null,
                error: "Product not found.",
            };
        }

        return {
            success: true,
            product: productRecord,
        };
    } catch (error) {
        console.error("Get product by slug error:", error);
        const e = error as Error;
        return {
            success: false,
            product: null,
            error: e.message || "Failed to fetch product.",
        };
    }
}

/**
 * Get featured products for home page
 */
export async function getFeaturedProducts(limit: number = 6) {
    try {
        const products = await db
            .select()
            .from(product)
            .where(and(eq(product.isActive, true), eq(product.isFeatured, true)))
            .limit(limit);

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Get featured products error:", error);
        const e = error as Error;
        return {
            success: false,
            products: [],
            error: e.message || "Failed to fetch featured products.",
        };
    }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string) {
    try {
        const products = await db
            .select()
            .from(product)
            .where(and(eq(product.isActive, true), eq(product.category, category)));

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Get products by category error:", error);
        const e = error as Error;
        return {
            success: false,
            products: [],
            error: e.message || "Failed to fetch products by category.",
        };
    }
}

/**
 * Search products by query
 */
export async function searchProducts(query: string) {
    try {
        const products = await db
            .select()
            .from(product)
            .where(
                and(
                    eq(product.isActive, true),
                    or(
                        like(product.name, `%${query}%`),
                        like(product.description || "", `%${query}%`),
                        like(product.shortDescription || "", `%${query}%`)
                    )!
                )
            );

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Search products error:", error);
        const e = error as Error;
        return {
            success: false,
            products: [],
            error: e.message || "Failed to search products.",
        };
    }
}

