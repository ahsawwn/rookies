import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

        // TODO: Implement unread count from database
        // For now, return 0
        return NextResponse.json({
            count: 0,
        });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return NextResponse.json(
            { error: "Failed to fetch unread count" },
            { status: 500 }
        );
    }
}

