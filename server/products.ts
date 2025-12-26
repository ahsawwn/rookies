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
    includeInactive?: boolean; // For admin pages
}

/**
 * Get all active products with optional filters
 */
export async function getProducts(filters?: ProductFilters) {
    try {
        // For admin pages, include inactive products if requested
        const conditions: any[] = [];
        if (!filters?.includeInactive) {
            conditions.push(eq(product.isActive, true));
        }

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

        // Get total count for pagination
        let totalCountQuery = db.select({ count: sql<number>`count(*)` }).from(product);
        if (conditions.length > 0) {
            totalCountQuery = totalCountQuery.where(and(...conditions));
        }
        const [totalCountResult] = await totalCountQuery;
        const total = Number(totalCountResult?.count || 0);
        
        // Get products - Select only existing columns to avoid migration issues
        let productsQuery = db.select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            images: product.images,
            category: product.category,
            calories: product.calories,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            stock: product.stock,
            metadata: product.metadata,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            // Only include new columns if they exist (will be null if column doesn't exist)
            weeklyStartDate: product.weeklyStartDate,
            weeklyEndDate: product.weeklyEndDate,
            isVisible: product.isVisible,
        }).from(product);
        if (conditions.length > 0) {
            productsQuery = productsQuery.where(and(...conditions));
        }
        
        const products = await productsQuery
            .orderBy(orderByClause)
            .limit(limitNum)
            .offset(offset);

        // Log for debugging
        console.log(`[getProducts] Found ${products.length} products with filters:`, {
            includeInactive: filters?.includeInactive,
            category: filters?.category,
            limit: limitNum,
        });

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
        
        // If error is about missing columns, try query without new columns
        if (e.message?.includes('weekly_start_date') || e.message?.includes('weekly_end_date') || e.message?.includes('is_visible')) {
            try {
                // Retry with only existing columns
                let fallbackQuery = db.select({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    shortDescription: product.shortDescription,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    images: product.images,
                    category: product.category,
                    calories: product.calories,
                    isActive: product.isActive,
                    isFeatured: product.isFeatured,
                    stock: product.stock,
                    metadata: product.metadata,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                }).from(product);
                if (conditions.length > 0) {
                    fallbackQuery = fallbackQuery.where(and(...conditions));
                }
                const fallbackProducts = await fallbackQuery
                    .orderBy(orderByClause)
                    .limit(limitNum)
                    .offset(offset);
                
                return {
                    success: true,
                    products: fallbackProducts,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total: fallbackProducts.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false,
                    },
                };
            } catch (fallbackError) {
                // Fallback query failed, continue to return error
            }
        }
        
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

