// drizzle.config.ts - FIXED FOR DRIZZLE KIT 0.20+
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql', // Changed from 'driver' to 'dialect'
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Changed from 'connectionString' to 'url'
    },
});