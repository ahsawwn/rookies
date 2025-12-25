import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL as string);
export const db = drizzle(sql, { schema });