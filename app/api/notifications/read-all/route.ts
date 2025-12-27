import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // TODO: Implement mark all as read in database
        // For now, return success
        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Error marking all as read:", error);
        return NextResponse.json(
            { error: "Failed to mark all as read" },
            { status: 500 }
        );
    }
}

