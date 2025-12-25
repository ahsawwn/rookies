"use server";

import { eq, and, or, like, desc, asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";

export interface ProductFilters {
    category?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
    featured?: boolean;
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

        let products = await db
            .select()
            .from(product)
            .where(and(...conditions));

        // Sort products
        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case "price-asc":
                    products = products.sort((a, b) =>
                        parseFloat(a.price) - parseFloat(b.price)
                    );
                    break;
                case "price-desc":
                    products = products.sort((a, b) =>
                        parseFloat(b.price) - parseFloat(a.price)
                    );
                    break;
                case "name-asc":
                    products = products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "name-desc":
                    products = products.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case "newest":
                    products = products.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
                    break;
            }
        } else {
            // Default: newest first
            products = products.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        return {
            success: true,
            products,
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

