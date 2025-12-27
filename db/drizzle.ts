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
        const error = new Error(
            "DATABASE_URL environment variable is not set. " +
            "Please set it in your .env.local file. " +
            "Format: DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require"
        );
        // Use console.warn instead of console.error to avoid error spam
        console.warn("Database initialization warning:", error.message);
        throw error;
    }

    console.log("Initializing database with URL:", databaseUrl ? "present" : "missing");

    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
    return _db;
}

// Export a proxy that initializes on first access
// This allows the module to be imported without immediately connecting to the database
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_target, prop) {
        try {
            const database = initializeDatabase();
            const value = (database as any)[prop];
            
            // If it's a function, bind it to the database instance
            if (typeof value === 'function') {
                return value.bind(database);
            }
            
            return value;
        } catch (error) {
            // If database initialization fails, throw a more helpful error
            const e = error as Error;
            if (e.message.includes('DATABASE_URL')) {
                throw new Error(
                    'Database connection failed: DATABASE_URL environment variable is not set. ' +
                    'Please create a .env.local file with: DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require'
                );
            }
            throw error;
        }
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
