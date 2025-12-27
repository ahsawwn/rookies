import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/db/drizzle";
import { user, order } from "@/db/schema";
import { eq, and, gte, sql, isNotNull, count } from "drizzle-orm";
import { getCurrentAdmin } from "@/server/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const adminResult = await getCurrentAdmin();
        if (!adminResult.success || !adminResult.admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { templateId, segment, subject, message } = await request.json();

        if (!templateId || !segment || !subject || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json(
                { error: "Email service not configured" },
                { status: 500 }
            );
        }

        // Query customers based on segment
        let customers: Array<{ email: string; name: string | null }> = [];

        if (segment === "all") {
            // Get all users with email
            const allUsers = await db.query.user.findMany({
                where: isNotNull(user.email),
                columns: {
                    email: true,
                    name: true,
                },
            });
            customers = allUsers.filter((u) => u.email) as Array<{ email: string; name: string | null }>;
        } else if (segment === "recent") {
            // Recent customers (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentOrders = await db
                .selectDistinct({
                    email: user.email,
                    name: user.name,
                })
                .from(order)
                .innerJoin(user, eq(order.userId, user.id))
                .where(
                    and(
                        isNotNull(user.email),
                        gte(order.createdAt, thirtyDaysAgo)
                    )
                );

            customers = recentOrders.filter((u) => u.email) as Array<{ email: string; name: string | null }>;
        } else if (segment === "frequent") {
            // Frequent customers (5+ orders)
            const frequentCustomers = await db
                .select({
                    email: user.email,
                    name: user.name,
                    orderCount: sql<number>`count(${order.id})`,
                })
                .from(user)
                .innerJoin(order, eq(order.userId, user.id))
                .where(isNotNull(user.email))
                .groupBy(user.id, user.email, user.name)
                .having(sql`count(${order.id}) >= 5`);

            customers = frequentCustomers
                .filter((u) => u.email)
                .map((u) => ({ email: u.email!, name: u.name })) as Array<{ email: string; name: string | null }>;
        } else if (segment === "inactive") {
            // Inactive customers (no orders in 60 days)
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            // Get all users with email
            const allUsersWithEmail = await db.query.user.findMany({
                where: isNotNull(user.email),
                columns: {
                    id: true,
                    email: true,
                    name: true,
                },
                with: {
                    orders: {
                        where: gte(order.createdAt, sixtyDaysAgo),
                        limit: 1,
                    },
                },
            });

            // Filter users with no recent orders
            customers = allUsersWithEmail
                .filter((u) => u.email && u.orders.length === 0)
                .map((u) => ({ email: u.email!, name: u.name })) as Array<{ email: string; name: string | null }>;
        }

        // Remove duplicates and filter out invalid emails
        const uniqueCustomers = Array.from(
            new Map(customers.map((c) => [c.email, c])).values()
        ).filter((c) => c.email && c.email.includes("@"));

        if (uniqueCustomers.length === 0) {
            return NextResponse.json(
                { error: "No customers found for the selected segment" },
                { status: 400 }
            );
        }

        // Send emails
        const emailPromises = uniqueCustomers.map((customer) =>
            resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME || "ROOKIES Bakery"} <${process.env.EMAIL_SENDER_ADDRESS || "onboarding@resend.dev"}>`,
                to: customer.email,
                subject: subject.replace(/\{\{orderNumber\}\}/g, "").trim(),
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">ROOKIES Home based Bakery</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                ${message.split("\n").map((line: string) => `<div style="margin-bottom: 12px;">${line || "&nbsp;"}</div>`).join("")}
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">ROOKIES Home based Bakery</p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Fresh baked goods from Pakistan</p>
        </div>
    </div>
</body>
</html>
                `.trim(),
            })
        );

        const results = await Promise.allSettled(emailPromises);
        const successful = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;

        return NextResponse.json({
            success: true,
            recipientCount: successful,
            totalRecipients: uniqueCustomers.length,
            failed,
        });
    } catch (error) {
        console.error("Error sending emails:", error);
        const e = error as Error;
        return NextResponse.json(
            { error: e.message || "Failed to send emails" },
            { status: 500 }
        );
    }
}

