"use server";

import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { admin, adminSession } from "@/db/schema";
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session_token";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(): string {
    return randomBytes(32).toString("hex");
}

function generateId(): string {
    return randomBytes(16).toString("hex");
}

// Validation schemas
const adminLoginSchema = z.object({
    email: z.string().email("Invalid email address").max(255, "Email too long"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

/**
 * Admin login
 */
export async function adminLogin(email: string, password: string) {
    try {
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            return {
                success: false,
                error: "Database not configured. Please set DATABASE_URL in your .env.local file.",
            };
        }

        // Validate input
        const validated = adminLoginSchema.parse({ email, password });
        
        // Sanitize email (lowercase, trim)
        const sanitizedEmail = validated.email.toLowerCase().trim();

        const adminRecord = await db.query.admin.findFirst({
            where: eq(admin.email, sanitizedEmail),
        });

        if (!adminRecord) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        if (!adminRecord.isActive) {
            return {
                success: false,
                error: "Account is deactivated",
            };
        }

        const passwordMatch = await compare(validated.password, adminRecord.password);

        if (!passwordMatch) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + SESSION_DURATION);

        await db.insert(adminSession).values({
            id: generateId(),
            adminId: adminRecord.id,
            token,
            expiresAt,
        });

        // Update last login
        await db
            .update(admin)
            .set({ lastLogin: new Date(), updatedAt: new Date() })
            .where(eq(admin.id, adminRecord.id));

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set(ADMIN_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_DURATION / 1000,
            path: "/",
        });

        return {
            success: true,
            admin: {
                id: adminRecord.id,
                email: adminRecord.email,
                name: adminRecord.name,
                role: adminRecord.role,
            },
        };
    } catch (error) {
        console.error("Admin login error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to login",
        };
    }
}

/**
 * Get current admin from session
 */
export async function getCurrentAdmin() {
    try {
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.warn("DATABASE_URL not set, admin session check skipped");
            return {
                success: false,
                admin: null,
            };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

        if (!token) {
            return {
                success: false,
                admin: null,
            };
        }

        const session = await db.query.adminSession.findFirst({
            where: eq(adminSession.token, token),
        });

        if (!session) {
            return {
                success: false,
                admin: null,
            };
        }

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            await db.delete(adminSession).where(eq(adminSession.id, session.id));
            return {
                success: false,
                admin: null,
            };
        }

        const adminRecord = await db.query.admin.findFirst({
            where: eq(admin.id, session.adminId),
        });

        if (!adminRecord || !adminRecord.isActive) {
            return {
                success: false,
                admin: null,
            };
        }

        return {
            success: true,
            admin: {
                id: adminRecord.id,
                email: adminRecord.email,
                name: adminRecord.name,
                role: adminRecord.role,
            },
        };
    } catch (error) {
        console.error("Get current admin error:", error);
        // Return false instead of throwing - allows page to render
        return {
            success: false,
            admin: null,
        };
    }
}

/**
 * Admin logout
 */
export async function adminLogout() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

        if (token) {
            await db.delete(adminSession).where(eq(adminSession.token, token));
        }

        cookieStore.delete(ADMIN_SESSION_COOKIE);

        return {
            success: true,
        };
    } catch (error) {
        console.error("Admin logout error:", error);
        return {
            success: false,
            error: "Failed to logout",
        };
    }
}

