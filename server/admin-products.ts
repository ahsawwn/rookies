"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { product } from "@/db/schema";
import { getCurrentAdmin } from "./admin";
import { randomBytes } from "crypto";

function generateId(): string {
    return randomBytes(16).toString("hex");
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Create a new product
 */
export async function createProduct(data: {
    name: string;
    description?: string;
    shortDescription?: string;
    price: string;
    originalPrice?: string;
    image: string;
    images?: string[];
    category: string;
    calories?: number;
    stock: number;
    isFeatured?: boolean;
}) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const id = generateId();
        const slug = slugify(data.name);

        await db.insert(product).values({
            id,
            name: data.name,
            slug,
            description: data.description || null,
            shortDescription: data.shortDescription || null,
            price: data.price,
            originalPrice: data.originalPrice || null,
            image: data.image,
            images: data.images || null,
            category: data.category,
            calories: data.calories || null,
            isActive: true,
            isFeatured: data.isFeatured || false,
            stock: data.stock,
        });

        return {
            success: true,
            productId: id,
        };
    } catch (error) {
        console.error("Create product error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create product",
        };
    }
}

/**
 * Update an existing product
 */
export async function updateProduct(
    productId: string,
    data: {
        name?: string;
        description?: string;
        shortDescription?: string;
        price?: string;
        originalPrice?: string;
        image?: string;
        images?: string[];
        category?: string;
        calories?: number;
        stock?: number;
        isFeatured?: boolean;
        isActive?: boolean;
    }
) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (data.name) {
            updateData.name = data.name;
            updateData.slug = slugify(data.name);
        }
        if (data.description !== undefined) updateData.description = data.description;
        if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
        if (data.price) updateData.price = data.price;
        if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
        if (data.image) updateData.image = data.image;
        if (data.images !== undefined) updateData.images = data.images;
        if (data.category) updateData.category = data.category;
        if (data.calories !== undefined) updateData.calories = data.calories;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        await db.update(product).set(updateData).where(eq(product.id, productId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update product error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to update product",
        };
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        await db.delete(product).where(eq(product.id, productId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Delete product error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to delete product",
        };
    }
}

/**
 * Toggle product active status
 */
export async function toggleProductStatus(productId: string) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const productRecord = await db.query.product.findFirst({
            where: eq(product.id, productId),
        });

        if (!productRecord) {
            return {
                success: false,
                error: "Product not found",
            };
        }

        await db
            .update(product)
            .set({ isActive: !productRecord.isActive, updatedAt: new Date() })
            .where(eq(product.id, productId));

        return {
            success: true,
            isActive: !productRecord.isActive,
        };
    } catch (error) {
        console.error("Toggle product status error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to toggle product status",
        };
    }
}

