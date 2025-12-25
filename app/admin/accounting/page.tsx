import { AdminCard } from "@/components/admin/Card";
import { DashboardStat } from "@/components/admin/DashboardStats";
import { DataTable } from "@/components/admin/DataTable";
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

export default function AccountingPage() {
    // Mock data - replace with real data
    const transactions: any[] = [];
    const totalRevenue = 12500.50;
    const totalExpenses = 8500.25;
    const profit = totalRevenue - totalExpenses;

    const columns = [
        {
            key: "date",
            header: "Date",
            render: (transaction: any) =>
                new Date(transaction.createdAt || Date.now()).toLocaleDateString(),
        },
        {
            key: "type",
            header: "Type",
            render: (transaction: any) => (
                <Badge
                    className={
                        transaction.type === "income"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                    }
                >
                    {transaction.type || "expense"}
                </Badge>
            ),
        },
        {
            key: "category",
            header: "Category",
        },
        {
            key: "description",
            header: "Description",
        },
        {
            key: "amount",
            header: "Amount",
            render: (transaction: any) => (
                <span
                    className={
                        transaction.type === "income" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                    }
                >
                    {transaction.type === "income" ? "+" : "-"}
                    ${parseFloat(transaction.amount || "0").toFixed(2)}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
                <p className="text-gray-600 mt-1">Financial overview and transaction management</p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardStat
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={<FiTrendingUp className="w-6 h-6" />}
                    color="green"
                />
                <DashboardStat
                    title="Total Expenses"
                    value={`$${totalExpenses.toFixed(2)}`}
                    icon={<FiTrendingDown className="w-6 h-6" />}
                    color="red"
                />
                <DashboardStat
                    title="Net Profit"
                    value={`$${profit.toFixed(2)}`}
                    icon={<FiDollarSign className="w-6 h-6" />}
                    color={profit >= 0 ? "green" : "red"}
                />
            </div>

            {/* Transactions Table */}
            <AdminCard
                header={<h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>}
            >
                {transactions.length > 0 ? (
                    <DataTable
                        data={transactions}
                        columns={columns}
                        pagination={{
                            page: 1,
                            pageSize: 10,
                            total: transactions.length,
                            onPageChange: () => {},
                        }}
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No transactions recorded yet</p>
                    </div>
                )}
            </AdminCard>
        </div>
    );
}

