import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required", isAdmin: false },
                { status: 400 }
            );
        }

        // Check if email exists in admin table
        const adminRecord = await db.query.admin.findFirst({
            where: eq(admin.email, email),
        });

        return NextResponse.json({
            isAdmin: !!adminRecord && adminRecord.isActive,
        });
    } catch (error) {
        console.error("Error checking admin status:", error);
        return NextResponse.json(
            { error: "Failed to check admin status", isAdmin: false },
            { status: 500 }
        );
    }
}

