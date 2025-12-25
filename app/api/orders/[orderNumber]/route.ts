import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber } from "@/server/orders";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;
        
        if (!orderNumber) {
            return NextResponse.json(
                { error: "Order number is required" },
                { status: 400 }
            );
        }

        const result = await getOrderByNumber(orderNumber);

        if (!result.success || !result.order) {
            return NextResponse.json(
                { error: result.error || "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ order: result.order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

