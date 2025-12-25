import { db } from "@/db/drizzle";
import { otp } from "@/db/schema";
import { sql } from "drizzle-orm";

async function clearOldOTPs() {
    try {
        // Delete all OTP records older than 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const result = await db.delete(otp).where(sql`created_at < ${oneHourAgo}`);
        console.log("Old OTPs cleared successfully");
    } catch (error) {
        console.error("Error clearing OTPs:", error);
    }
}

clearOldOTPs();

