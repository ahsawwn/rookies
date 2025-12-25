"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
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

// Validation schemas
const createProductSchema = z.object({
    name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
    description: z.string().max(5000, "Description must be less than 5000 characters").optional(),
    shortDescription: z.string().max(500, "Short description must be less than 500 characters").optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
    originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Original price must be a valid number").optional().nullable(),
    image: z.string().url("Image must be a valid URL").max(1000, "Image URL too long"),
    images: z.array(z.string().url().max(1000)).optional().nullable(),
    category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters"),
    calories: z.number().int().positive().max(10000, "Calories must be reasonable").optional().nullable(),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
    isFeatured: z.boolean().optional(),
});

const updateProductSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    shortDescription: z.string().max(500).optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().nullable(),
    image: z.string().url().max(1000).optional(),
    images: z.array(z.string().url().max(1000)).optional().nullable(),
    category: z.string().min(1).max(50).optional(),
    calories: z.number().int().positive().max(10000).optional().nullable(),
    stock: z.number().int().nonnegative().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

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

        // Validate input
        const validatedData = createProductSchema.parse(data);

        const id = generateId();
        const slug = slugify(validatedData.name);

        await db.insert(product).values({
            id,
            name: validatedData.name,
            slug,
            description: validatedData.description || null,
            shortDescription: validatedData.shortDescription || null,
            price: validatedData.price,
            originalPrice: validatedData.originalPrice || null,
            image: validatedData.image,
            images: validatedData.images || null,
            category: validatedData.category,
            calories: validatedData.calories || null,
            isActive: true,
            isFeatured: validatedData.isFeatured || false,
            stock: validatedData.stock,
        });

        return {
            success: true,
            productId: id,
        };
    } catch (error) {
        console.error("Create product error:", error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            };
        }
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

        // Validate productId
        if (!productId || typeof productId !== 'string' || productId.length > 100) {
            return {
                success: false,
                error: "Invalid product ID",
            };
        }

        // Validate input
        const validatedData = updateProductSchema.parse(data);

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (validatedData.name) {
            updateData.name = validatedData.name;
            updateData.slug = slugify(validatedData.name);
        }
        if (validatedData.description !== undefined) updateData.description = validatedData.description;
        if (validatedData.shortDescription !== undefined) updateData.shortDescription = validatedData.shortDescription;
        if (validatedData.price) updateData.price = validatedData.price;
        if (validatedData.originalPrice !== undefined) updateData.originalPrice = validatedData.originalPrice;
        if (validatedData.image) updateData.image = validatedData.image;
        if (validatedData.images !== undefined) updateData.images = validatedData.images;
        if (validatedData.category) updateData.category = validatedData.category;
        if (validatedData.calories !== undefined) updateData.calories = validatedData.calories;
        if (validatedData.stock !== undefined) updateData.stock = validatedData.stock;
        if (validatedData.isFeatured !== undefined) updateData.isFeatured = validatedData.isFeatured;
        if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;

        await db.update(product).set(updateData).where(eq(product.id, productId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update product error:", error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            };
        }
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

        // Validate productId
        if (!productId || typeof productId !== 'string' || productId.length > 100) {
            return {
                success: false,
                error: "Invalid product ID",
            };
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

        // Validate productId
        if (!productId || typeof productId !== 'string' || productId.length > 100) {
            return {
                success: false,
                error: "Invalid product ID",
            };
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

