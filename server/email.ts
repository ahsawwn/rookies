"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
    product: {
        name: string;
        image?: string | null;
    } | null;
    quantity: number;
    priceAtTime: string;
}

interface OrderData {
    orderNumber: string;
    totalAmount: string;
    deliveryType: "delivery" | "pickup";
    deliveryAddress?: any;
    pickupName?: string | null;
    pickupPhone?: string | null;
    pickupVerificationCode?: string | null;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    items: OrderItem[];
    createdAt: Date;
}

export async function sendOrderConfirmationEmail(
    orderData: OrderData,
    userEmail: string,
    userName?: string | null
) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY not configured");
            return { success: false, error: "Email service not configured" };
        }

        const totalAmount = parseFloat(orderData.totalAmount);
        const itemsHtml = orderData.items
            .map(
                (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    ${item.product?.name || "Product"}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    Rs. ${(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                </td>
            </tr>
        `
            )
            .join("");

        const deliveryInfoHtml =
            orderData.deliveryType === "pickup"
                ? `
            <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px;">Pickup Information</h3>
                <p style="margin: 4px 0; color: #374151;"><strong>Name:</strong> ${orderData.pickupName || "N/A"}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Phone:</strong> ${orderData.pickupPhone || "N/A"}</p>
                ${orderData.pickupVerificationCode ? `
                <div style="margin-top: 12px; padding: 12px; background-color: #fce7f3; border: 2px solid #ec4899; border-radius: 6px;">
                    <p style="margin: 0 0 8px 0; color: #be185d; font-size: 14px; font-weight: 600;">Verification Code</p>
                    <p style="margin: 0; color: #ec4899; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${orderData.pickupVerificationCode}</p>
                    <p style="margin: 8px 0 0 0; color: #9f1239; font-size: 12px;">Please bring this code and a valid ID when picking up your order.</p>
                </div>
                ` : ""}
            </div>
        `
                : `
            <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px;">Delivery Address</h3>
                ${orderData.deliveryAddress ? `
                    <p style="margin: 4px 0; color: #374151;">
                        ${orderData.deliveryAddress.street || ""}
                        ${orderData.deliveryAddress.city ? `, ${orderData.deliveryAddress.city}` : ""}
                        ${orderData.deliveryAddress.state ? `, ${orderData.deliveryAddress.state}` : ""}
                        ${orderData.deliveryAddress.zipCode ? ` ${orderData.deliveryAddress.zipCode}` : ""}
                    </p>
                    ${orderData.deliveryAddress.phone ? `<p style="margin: 4px 0; color: #374151;"><strong>Phone:</strong> ${orderData.deliveryAddress.phone}</p>` : ""}
                ` : "<p style='color: #374151;'>Address not provided</p>"}
            </div>
        `;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ROOKIES Bakery</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">ROOKIES Home based Bakery</h1>
            <p style="margin: 8px 0 0 0; color: #fce7f3; font-size: 16px;">Order Confirmation</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">✓</span>
                </div>
                <h2 style="margin: 0 0 8px 0; color: #111827; font-size: 24px; font-weight: bold;">Order Confirmed!</h2>
                <p style="margin: 0; color: #6b7280; font-size: 16px;">Thank you for your order, ${userName || "Valued Customer"}!</p>
            </div>

            <!-- Order Number -->
            <div style="background-color: #fce7f3; border: 2px solid #ec4899; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #9f1239; font-size: 14px; font-weight: 600;">Order Number</p>
                <p style="margin: 0; color: #ec4899; font-size: 24px; font-weight: bold; letter-spacing: 1px;">${orderData.orderNumber}</p>
            </div>

            <!-- Order Items -->
            <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f9fafb;">
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #374151; font-size: 14px; font-weight: 600;">Item</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #374151; font-size: 14px; font-weight: 600;">Qty</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #374151; font-size: 14px; font-weight: 600;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: 600; color: #111827;">Total:</td>
                            <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold; color: #ec4899; font-size: 18px;">Rs. ${totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            ${deliveryInfoHtml}

            <!-- Payment Info -->
            <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px;">Payment Information</h3>
                <p style="margin: 4px 0; color: #374151;"><strong>Payment Method:</strong> ${orderData.paymentMethod || "N/A"}</p>
                <p style="margin: 4px 0; color: #374151;"><strong>Payment Status:</strong> <span style="text-transform: capitalize;">${orderData.paymentStatus || "Pending"}</span></p>
                <p style="margin: 4px 0; color: #374151;"><strong>Order Status:</strong> <span style="text-transform: capitalize;">${orderData.status}</span></p>
            </div>

            <!-- Footer Message -->
            <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>Note:</strong> You can track your order status in your profile. We'll notify you when your order is ready!
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">ROOKIES Home based Bakery</p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Fresh baked goods from Pakistan</p>
            <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
                Order placed on ${new Date(orderData.createdAt).toLocaleString("en-PK", {
                    dateStyle: "long",
                    timeStyle: "short",
                })}
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const { data, error } = await resend.emails.send({
            from: "ROOKIES Bakery <onboarding@resend.dev>", // Update with your verified domain
            to: userEmail,
            subject: `Order Confirmation - ${orderData.orderNumber}`,
            html: emailHtml,
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error("Send email error:", error);
        const e = error as Error;
        return { success: false, error: e.message || "Failed to send email" };
    }
}

