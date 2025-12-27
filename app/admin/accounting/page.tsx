import { getAllTransactions } from "@/server/accounting";
import { AccountingPageClient } from "@/components/admin/AccountingPageClient";

export default async function AccountingPage() {
    const result = await getAllTransactions();
    const transactions = result.success 
        ? result.transactions.map(t => ({
            ...t,
            description: t.description ?? undefined,
        }))
        : [];
    const totalIncome = result.success ? result.totalIncome : 0;
    const totalExpenses = result.success ? result.totalExpenses : 0;
    const netProfit = result.success ? result.netProfit : 0;

    return (
        <AccountingPageClient
            initialTransactions={transactions}
            initialTotalIncome={totalIncome}
            initialTotalExpenses={totalExpenses}
            initialNetProfit={netProfit}
        />
    );
}
