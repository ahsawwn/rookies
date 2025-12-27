import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

async function testConnection() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl || databaseUrl.includes("user:password@host")) {
        console.error("❌ DATABASE_URL is not set or is still a placeholder!");
        console.log("\n📝 Please update your .env.local file with your actual Neon database connection string.");
        console.log("   Get it from: https://console.neon.tech/");
        console.log("\n   Format: DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require");
        process.exit(1);
    }

    try {
        console.log("🔌 Testing database connection...");
        const sql = neon(databaseUrl);
        
        // Simple test query
        const result = await sql`SELECT 1 as test`;
        
        if (result && result.length > 0) {
            console.log("✅ Database connection successful!");
            return true;
        } else {
            console.error("❌ Database connection failed - no response");
            return false;
        }
    } catch (error: any) {
        console.error("❌ Database connection failed!");
        console.error("   Error:", error.message);
        console.log("\n💡 Common issues:");
        console.log("   1. Check if your DATABASE_URL is correct");
        console.log("   2. Make sure your Neon database is active");
        console.log("   3. Verify the connection string includes ?sslmode=require");
        return false;
    }
}

testConnection().then((success) => {
    process.exit(success ? 0 : 1);
});


