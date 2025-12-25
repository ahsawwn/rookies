"use server";

import { eq, inArray, not, and, gt, desc, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { member, user, otp, session, order, admin } from "@/db/schema";
import { auth } from "@/lib/auth";
import { validatePakistaniPhone, normalizePhone } from "@/lib/phone-validation";
import { sendWhatsAppOTP } from "@/lib/twilio";
import { randomBytes, createHash } from "crypto";

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
    });

    if (!currentUser) {
        redirect("/login");
    }

    return {
        ...session,
        currentUser,
    };
};

export const signIn = async (email: string, password: string) => {
    try {
        const result = await auth.api.signInEmail({
            headers: await headers(),
            body: {
                email,
                password,
            },
        });

        if (result.error) {
            return {
                success: false,
                message: result.error.message || "Failed to sign in.",
            };
        }

        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (error) {
        const e = error as Error;

        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
};

export const signUp = async (
    email: string,
    password: string,
    username: string
) => {
    try {
        const result = await auth.api.signUpEmail({
            headers: await headers(),
            body: {
                email,
                password,
                name: username,
            },
        });

        if (result.error) {
            return {
                success: false,
                message: result.error.message || "Failed to sign up.",
            };
        }

        return {
            success: true,
            message: "Signed up successfully.",
        };
    } catch (error) {
        const e = error as Error;

        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
};

export const getUsers = async (organizationId: string) => {
    try {
        const members = await db.query.member.findMany({
            where: eq(member.organizationId, organizationId),
        });

        const users = await db.query.user.findMany({
            where: not(
                inArray(
                    user.id,
                    members.map((m) => m.userId)
                )
            ),
        });

        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a unique ID for OTP record
 */
function generateId(): string {
    return randomBytes(16).toString("hex");
}

/**
 * Send OTP code via WhatsApp
 * Rate limit: 3 requests per phone per hour
 */
export async function sendOTP(phone: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Validate phone number
        const validation = validatePakistaniPhone(phone);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.error || "Invalid phone number",
            };
        }

        const normalizedPhone = validation.normalized!;

        // Check rate limit (max 3 requests per hour)
        // In development, allow more requests for testing
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const rateLimit = isDevelopment ? 10 : 3;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        // In development, also clear old unverified OTPs to prevent rate limit issues during testing
        if (isDevelopment) {
            try {
                await db.delete(otp).where(
                    and(
                        eq(otp.phone, normalizedPhone),
                        eq(otp.verified, false),
                        sql`created_at < ${oneHourAgo}`
                    )
                );
            } catch (e) {
                // Ignore errors in cleanup
            }
        }
        const recentOTPs = await db.query.otp.findMany({
            where: and(
                eq(otp.phone, normalizedPhone),
                gt(otp.createdAt, oneHourAgo)
            ),
            orderBy: [desc(otp.createdAt)],
        });

        if (recentOTPs.length >= rateLimit) {
            return {
                success: false,
                message: `Too many OTP requests (${recentOTPs.length}/${rateLimit}). Please try again in an hour.`,
            };
        }

        // Generate OTP code
        const code = generateOTP();
        const otpId = generateId();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in database
        await db.insert(otp).values({
            id: otpId,
            phone: normalizedPhone,
            code,
            expiresAt,
            attempts: 0,
            verified: false,
        });

        // Send via WhatsApp
        const sendResult = await sendWhatsAppOTP(normalizedPhone, code);
        if (!sendResult.success) {
            return {
                success: false,
                message: sendResult.error || "Failed to send OTP. Please try again.",
            };
        }

        return {
            success: true,
            message: "OTP sent successfully to your WhatsApp.",
        };
    } catch (error) {
        console.error("Send OTP error:", error);
        const e = error as Error;
        return {
            success: false,
            message: e.message || "Failed to send OTP. Please try again.",
        };
    }
}

/**
 * Verify OTP and login (or create user if doesn't exist)
 */
export async function verifyOTPAndLogin(
    phone: string,
    code: string
): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Validate and normalize phone
        const validation = validatePakistaniPhone(phone);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.error || "Invalid phone number",
            };
        }

        const normalizedPhone = validation.normalized!;

        // Find the most recent unverified OTP for this phone
        const otpRecord = await db.query.otp.findFirst({
            where: and(
                eq(otp.phone, normalizedPhone),
                eq(otp.verified, false)
            ),
            orderBy: [desc(otp.createdAt)],
        });

        if (!otpRecord) {
            return {
                success: false,
                message: "No OTP found. Please request a new code.",
            };
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            return {
                success: false,
                message: "OTP has expired. Please request a new code.",
            };
        }

        // Check attempts (max 5)
        if (otpRecord.attempts >= 5) {
            return {
                success: false,
                message: "Too many verification attempts. Please request a new code.",
            };
        }

        // Verify code
        if (otpRecord.code !== code) {
            // Increment attempts
            await db
                .update(otp)
                .set({ attempts: otpRecord.attempts + 1 })
                .where(eq(otp.id, otpRecord.id));

            return {
                success: false,
                message: "Invalid OTP code. Please try again.",
            };
        }

        // Mark OTP as verified
        await db
            .update(otp)
            .set({ verified: true })
            .where(eq(otp.id, otpRecord.id));

        // Find or create user
        let existingUser = await db.query.user.findFirst({
            where: eq(user.phone, normalizedPhone),
        });

        if (!existingUser) {
            // Create new user with phone
            const userId = generateId();
            await db.insert(user).values({
                id: userId,
                name: `User ${normalizedPhone.slice(-4)}`, // Temporary name
                phone: normalizedPhone,
                phoneVerified: true,
                emailVerified: false,
            });
            existingUser = await db.query.user.findFirst({
                where: eq(user.id, userId),
            });
        } else {
            // Update phone verified status
            await db
                .update(user)
                .set({ phoneVerified: true })
                .where(eq(user.id, existingUser.id));
        }

        if (!existingUser) {
            return {
                success: false,
                message: "Failed to create user session.",
            };
        }

        // Create session using better-auth's internal session creation
        // We'll create the session record and let better-auth handle cookies
        const sessionToken = randomBytes(32).toString("hex");
        const sessionId = generateId();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.insert(session).values({
            id: sessionId,
            userId: existingUser.id,
            token: sessionToken,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Note: Session cookie will be set by better-auth middleware
        // The session is now in the database and will be recognized

        return {
            success: true,
            message: "Logged in successfully.",
        };
    } catch (error) {
        console.error("Verify OTP error:", error);
        const e = error as Error;
        return {
            success: false,
            message: e.message || "Failed to verify OTP. Please try again.",
        };
    }
}

/**
 * Verify OTP and signup (create new user with name)
 */
export async function verifyOTPAndSignup(
    phone: string,
    code: string,
    name: string
): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Validate and normalize phone
        const validation = validatePakistaniPhone(phone);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.error || "Invalid phone number",
            };
        }

        const normalizedPhone = validation.normalized!;

        // Validate name
        if (!name || name.trim().length < 2) {
            return {
                success: false,
                message: "Name must be at least 2 characters long.",
            };
        }

        // Check if user already exists
        const existingUser = await db.query.user.findFirst({
            where: eq(user.phone, normalizedPhone),
        });

        if (existingUser) {
            return {
                success: false,
                message: "Phone number already registered. Please login instead.",
            };
        }

        // Find the most recent unverified OTP for this phone
        const otpRecord = await db.query.otp.findFirst({
            where: and(
                eq(otp.phone, normalizedPhone),
                eq(otp.verified, false)
            ),
            orderBy: [desc(otp.createdAt)],
        });

        if (!otpRecord) {
            return {
                success: false,
                message: "No OTP found. Please request a new code.",
            };
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            return {
                success: false,
                message: "OTP has expired. Please request a new code.",
            };
        }

        // Check attempts (max 5)
        if (otpRecord.attempts >= 5) {
            return {
                success: false,
                message: "Too many verification attempts. Please request a new code.",
            };
        }

        // Verify code
        if (otpRecord.code !== code) {
            // Increment attempts
            await db
                .update(otp)
                .set({ attempts: otpRecord.attempts + 1 })
                .where(eq(otp.id, otpRecord.id));

            return {
                success: false,
                message: "Invalid OTP code. Please try again.",
            };
        }

        // Mark OTP as verified
        await db
            .update(otp)
            .set({ verified: true })
            .where(eq(otp.id, otpRecord.id));

        // Create new user
        const userId = generateId();
        await db.insert(user).values({
            id: userId,
            name: name.trim(),
            phone: normalizedPhone,
            phoneVerified: true,
            emailVerified: false,
        });

        // Create session using better-auth's internal session creation
        const sessionToken = randomBytes(32).toString("hex");
        const sessionId = generateId();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.insert(session).values({
            id: sessionId,
            userId,
            token: sessionToken,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Note: Session cookie will be set by better-auth middleware

        return {
            success: true,
            message: "Account created successfully.",
        };
    } catch (error) {
        console.error("Verify OTP signup error:", error);
        const e = error as Error;
        return {
            success: false,
            message: e.message || "Failed to create account. Please try again.",
        };
    }
}

/**
 * Get all orders for the current user
 */
/**
 * Check if user is an admin
 */
export async function isUserAdmin(userId: string) {
    try {
        const userRecord = await db.query.user.findFirst({
            where: eq(user.id, userId),
        });

        if (!userRecord || !userRecord.email) {
            return {
                success: false,
                isAdmin: false,
            };
        }

        // Check if email exists in admin table
        const adminRecord = await db.query.admin.findFirst({
            where: eq(admin.email, userRecord.email),
        });

        return {
            success: true,
            isAdmin: !!adminRecord && adminRecord.isActive,
        };
    } catch (error) {
        console.error("Check user admin error:", error);
        return {
            success: false,
            isAdmin: false,
        };
    }
}

export async function getUserOrders() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            redirect("/login");
        }

        const userOrders = await db.query.order.findMany({
            where: eq(order.userId, session.user.id),
            orderBy: [desc(order.createdAt)],
        });

        return {
            success: true,
            orders: userOrders,
        };
    } catch (error) {
        console.error("Get user orders error:", error);
        const e = error as Error;
        return {
            success: false,
            orders: [],
            error: e.message || "Failed to fetch orders.",
        };
    }
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            redirect("/login");
        }

        const orderRecord = await db.query.order.findFirst({
            where: and(
                eq(order.id, orderId),
                eq(order.userId, session.user.id)
            ),
        });

        if (!orderRecord) {
            return {
                success: false,
                order: null,
                error: "Order not found.",
            };
        }

        return {
            success: true,
            order: orderRecord,
        };
    } catch (error) {
        console.error("Get order by ID error:", error);
        const e = error as Error;
        return {
            success: false,
            order: null,
            error: e.message || "Failed to fetch order.",
        };
    }
}