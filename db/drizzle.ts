import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

// Lazy initialization - only connect when database is actually accessed
let _db: NeonHttpDatabase<typeof schema> | null = null;

function initializeDatabase(): NeonHttpDatabase<typeof schema> {
    if (_db) {
        return _db;
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        const errorMessage = [
            "DATABASE_URL environment variable is not set.",
            "",
            "To fix this:",
            "1. Create a .env.local file in the root directory (d:\\Project\\rookies\\.env.local)",
            "2. Add your Neon PostgreSQL connection string:",
            "   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require",
            "",
            "Get your connection string from: https://console.neon.tech/",
            "After adding DATABASE_URL, restart your development server.",
        ].join("\n");

        throw new Error(errorMessage);
    }

    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
    return _db;
}

// Export a proxy that initializes on first access
// This allows the module to be imported without immediately connecting to the database
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_target, prop) {
        const database = initializeDatabase();
        const value = (database as any)[prop];
        
        // If it's a function, bind it to the database instance
        if (typeof value === 'function') {
            return value.bind(database);
        }
        
        return value;
    },
    has(_target, prop) {
        const database = initializeDatabase();
        return prop in database;
    },
    ownKeys(_target) {
        const database = initializeDatabase();
        return Object.keys(database);
    },
    getOwnPropertyDescriptor(_target, prop) {
        const database = initializeDatabase();
        const descriptor = Object.getOwnPropertyDescriptor(database, prop);
        if (descriptor) {
            return descriptor;
        }
        return undefined;
    },
}) as NeonHttpDatabase<typeof schema>;
