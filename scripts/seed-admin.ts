import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { admin } from "@/db/schema";
import { schema } from "@/db/schema";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql, { schema });

function generateId(): string {
    return randomBytes(16).toString("hex");
}

async function seedAdmin() {
    try {
        console.log("Creating admin account...");

        const email = "admin@rookies.com";
        const password = "admin123"; // Change this in production!
        const hashedPassword = await hash(password, 10);

        // Check if admin already exists
        const existing = await db.select().from(admin).where(eq(admin.email, email)).limit(1);

        if (existing.length > 0) {
            console.log("Admin account already exists. Updating password...");
            await db
                .update(admin)
                .set({ 
                    password: hashedPassword,
                    updatedAt: new Date()
                })
                .where(eq(admin.email, email));
            console.log("✅ Admin password updated successfully!");
            console.log("Email: admin@rookies.com");
            console.log("Password: admin123");
            return;
        }

        await db.insert(admin).values({
            id: generateId(),
            email,
            password: hashedPassword,
            name: "Admin User",
            role: "super_admin",
            isActive: true,
        });

        console.log("✅ Admin account created successfully!");
        console.log("Email: admin@rookies.com");
        console.log("Password: admin123");
        console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    } catch (error) {
        console.error("❌ Error creating admin account:", error);
        process.exit(1);
    }
}

seedAdmin();

