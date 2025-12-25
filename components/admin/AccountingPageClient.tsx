"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TransactionFormDialog } from "@/components/admin/TransactionFormDialog";
import { deleteTransaction } from "@/server/accounting";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiTrash2, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Transaction {
    id: string;
    type: "income" | "expense";
    category: string;
    description?: string;
    amount: string;
    createdAt: Date;
}

interface AccountingPageClientProps {
    initialTransactions: Transaction[];
    initialTotalIncome: number;
    initialTotalExpenses: number;
    initialNetProfit: number;
}

export function AccountingPageClient({
    initialTransactions,
    initialTotalIncome,
    initialTotalExpenses,
    initialNetProfit,
}: AccountingPageClientProps) {
    const router = useRouter();
    const [transactions, setTransactions] = useState(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesSearch = transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === "all" || transaction.type === typeFilter;
            const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
            const transactionDate = new Date(transaction.createdAt);
            const matchesStartDate = !startDate || transactionDate >= startDate;
            const matchesEndDate = !endDate || transactionDate <= endDate;
            return matchesSearch && matchesType && matchesCategory && matchesStartDate && matchesEndDate;
        });
    }, [transactions, searchQuery, typeFilter, categoryFilter, startDate, endDate]);

    const incomeTransactions = useMemo(() => filteredTransactions.filter(t => t.type === "income"), [filteredTransactions]);
    const expenseTransactions = useMemo(() => filteredTransactions.filter(t => t.type === "expense"), [filteredTransactions]);

    const totalIncome = useMemo(() => incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0), [incomeTransactions]);
    const totalExpenses = useMemo(() => expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0), [expenseTransactions]);
    const netProfit = totalIncome - totalExpenses;

    const formatCurrency = (amount: string | number) => {
        return `Rs. ${parseFloat(amount.toString()).toFixed(2)}`;
    };

    const categories = useMemo(() => {
        const cats = new Set(transactions.map(t => t.category));
        return Array.from(cats).sort();
    }, [transactions]);

    // Chart data - last 7 days
    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map(date => {
            const dayTransactions = transactions.filter(t => {
                const tDate = new Date(t.createdAt);
                return tDate.toDateString() === date.toDateString();
            });

            const income = dayTransactions
                .filter(t => t.type === "income")
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            const expenses = dayTransactions
                .filter(t => t.type === "expense")
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            return {
                date: format(date, "MMM dd"),
                income,
                expenses,
                profit: income - expenses,
            };
        });
    }, [transactions]);

    const handleDelete = async (transactionId: string) => {
        if (!confirm("Are you sure you want to delete this transaction?")) return;

        const result = await deleteTransaction(transactionId);
        if (result.success) {
            toast.success("Transaction deleted successfully");
            setTransactions(transactions.filter(t => t.id !== transactionId));
            router.refresh();
        } else {
            toast.error(result.error || "Failed to delete transaction");
        }
    };

    const handleDialogSuccess = () => {
        setTransactionDialogOpen(false);
        router.refresh();
    };

    const renderTransactionsTable = (transactionsToShow: Transaction[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactionsToShow.length > 0 ? (
                        transactionsToShow.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            transaction.type === "income"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-red-100 text-red-700 border-red-200"
                                        }
                                    >
                                        {transaction.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {transaction.description || "-"}
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${
                                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                                }`}>
                                    {transaction.type === "income" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(transaction.id)}
                                    >
                                        <FiTrash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <FiDollarSign className="w-12 h-12 text-gray-400" />
                                    <p className="text-gray-500 font-medium">No transactions found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
                    <p className="text-gray-600 mt-1">Financial overview and transaction management</p>
                </div>
                <Button
                    onClick={() => setTransactionDialogOpen(true)}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Transaction
                </Button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiTrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white border border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                            <p className="text-3xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <FiTrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className={`p-6 bg-white border rounded-xl bg-gradient-to-br ${
                    netProfit >= 0
                        ? "border-green-200 from-green-50 to-white"
                        : "border-red-200 from-red-50 to-white"
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                            <p className={`text-3xl font-bold ${
                                netProfit >= 0 ? "text-green-700" : "text-red-700"
                            }`}>
                                {formatCurrency(netProfit)}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${
                            netProfit >= 0 ? "bg-green-100" : "bg-red-100"
                        }`}>
                            <FiDollarSign className={`w-6 h-6 ${
                                netProfit >= 0 ? "text-green-600" : "text-red-600"
                            }`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                            <FiCalendar className="mr-2 h-4 w-4" />
                            {startDate && endDate
                                ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`
                                : "Date Range"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={{ from: startDate, to: endDate }}
                            onSelect={(range) => {
                                setStartDate(range?.from);
                                setEndDate(range?.to);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Expenses Chart */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="text-lg font-semibold mb-4">Expenses Trend (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Profit Chart */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Profit/Loss (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="profit" fill="#8b5cf6" name="Profit/Loss" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    {renderTransactionsTable(filteredTransactions)}
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span className="font-medium">Total Income</span>
                                <span className="text-xl font-bold text-green-700">{formatCurrency(totalIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                                <span className="font-medium">Total Expenses</span>
                                <span className="text-xl font-bold text-red-700">{formatCurrency(totalExpenses)}</span>
                            </div>
                            <div className={`flex justify-between items-center p-4 rounded-lg ${
                                netProfit >= 0 ? "bg-green-50" : "bg-red-50"
                            }`}>
                                <span className="font-medium">Net Profit</span>
                                <span className={`text-xl font-bold ${
                                    netProfit >= 0 ? "text-green-700" : "text-red-700"
                                }`}>
                                    {formatCurrency(netProfit)}
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="mt-4">
                            <FiDownload className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                        <div className="space-y-3">
                            {categories.map((category) => {
                                const categoryTransactions = transactions.filter(t => t.category === category);
                                const categoryTotal = categoryTransactions.reduce((sum, t) => {
                                    return sum + (t.type === "income" ? parseFloat(t.amount) : -parseFloat(t.amount));
                                }, 0);
                                return (
                                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">{category}</span>
                                        <span className={`font-semibold ${
                                            categoryTotal >= 0 ? "text-green-600" : "text-red-600"
                                        }`}>
                                            {formatCurrency(Math.abs(categoryTotal))}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Transaction Form Dialog */}
            <TransactionFormDialog
                open={transactionDialogOpen}
                onOpenChange={setTransactionDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}

