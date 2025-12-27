import { db } from "@/db/drizzle";
import { testimonial } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get all approved testimonials
 */
export async function getTestimonials(featuredOnly: boolean = false) {
    try {
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.warn("DATABASE_URL not set, returning empty testimonials");
            return {
                success: false,
                testimonials: [],
                error: "Database not configured",
            };
        }

        let query = db
            .select()
            .from(testimonial)
            .where(eq(testimonial.isApproved, true))
            .orderBy(desc(testimonial.createdAt));

        if (featuredOnly) {
            query = query.where(
                and(
                    eq(testimonial.isApproved, true),
                    eq(testimonial.isFeatured, true)
                )
            ) as any;
        }

        const testimonials = await query;

        return {
            success: true,
            testimonials,
        };
    } catch (error) {
        console.error("Get testimonials error:", error);
        const e = error as Error;
        // Return empty array instead of failing - component has fallback testimonials
        return {
            success: false,
            testimonials: [],
            error: e.message || "Failed to fetch testimonials.",
        };
    }
}

/**
 * Create a testimonial
 */
export async function createTestimonial(input: {
    name: string;
    role?: string;
    comment: string;
    rating: number;
    avatar?: string;
}) {
    try {
        const id = `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(testimonial).values({
            id,
            name: input.name,
            role: input.role,
            comment: input.comment,
            rating: input.rating,
            avatar: input.avatar,
            isApproved: false, // Requires admin approval
            isFeatured: false,
        });

        return {
            success: true,
            id,
        };
    } catch (error) {
        console.error("Create testimonial error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create testimonial.",
        };
    }
}

/**
 * Update testimonial (admin only)
 */
export async function updateTestimonial(
    id: string,
    input: {
        isApproved?: boolean;
        isFeatured?: boolean;
        adminId?: string;
    }
) {
    try {
        await db
            .update(testimonial)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(testimonial.id, id));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update testimonial error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to update testimonial.",
        };
    }
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(id: string) {
    try {
        await db.delete(testimonial).where(eq(testimonial.id, id));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Delete testimonial error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to delete testimonial.",
        };
    }
}

