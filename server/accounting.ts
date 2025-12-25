"use server";

import { eq, desc, and, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { transaction } from "@/db/schema";
import { getCurrentAdmin } from "./admin";
import { randomBytes } from "crypto";

function generateId(): string {
    return randomBytes(16).toString("hex");
}

const createTransactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
    date: z.string().optional(),
});

/**
 * Get all transactions
 */
export async function getAllTransactions(filters?: {
    type?: "income" | "expense";
    startDate?: Date;
    endDate?: Date;
}) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        let query = db.select().from(transaction);

        const conditions = [];

        if (filters?.type) {
            conditions.push(eq(transaction.type, filters.type));
        }

        if (filters?.startDate) {
            conditions.push(gte(transaction.createdAt, filters.startDate));
        }

        if (filters?.endDate) {
            conditions.push(lte(transaction.createdAt, filters.endDate));
        }

        const transactions = conditions.length > 0
            ? await db.select().from(transaction).where(and(...conditions)).orderBy(desc(transaction.createdAt))
            : await db.select().from(transaction).orderBy(desc(transaction.createdAt));

        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
            success: true,
            transactions,
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses,
        };
    } catch (error) {
        console.error("Get transactions error:", error);
        const e = error as Error;
        return {
            success: false,
            transactions: [],
            totalIncome: 0,
            totalExpenses: 0,
            netProfit: 0,
            error: e.message || "Failed to fetch transactions",
        };
    }
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: {
    type: "income" | "expense";
    category: string;
    description?: string;
    amount: string;
    date?: string;
}) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        const validatedData = createTransactionSchema.parse(data);

        const transactionId = generateId();

        await db.insert(transaction).values({
            id: transactionId,
            type: validatedData.type,
            category: validatedData.category,
            description: validatedData.description || null,
            amount: validatedData.amount,
            createdAt: validatedData.date ? new Date(validatedData.date) : new Date(),
        });

        return {
            success: true,
            transactionId,
        };
    } catch (error) {
        console.error("Create transaction error:", error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            };
        }
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to create transaction",
        };
    }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(transactionId: string) {
    try {
        const { success, admin } = await getCurrentAdmin();

        if (!success || !admin) {
            redirect("/admin/login");
        }

        await db.delete(transaction).where(eq(transaction.id, transactionId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Delete transaction error:", error);
        const e = error as Error;
        return {
            success: false,
            error: e.message || "Failed to delete transaction",
        };
    }
}

