"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { FiSearch, FiDownload, FiEye, FiCheck, FiX, FiClock, FiMoreVertical } from "react-icons/fi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { updateOrderStatus } from "@/server/orders";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface OrdersPageClientProps {
    initialOrders: any[];
    categorizedOrders: {
        pending: any[];
        processing: any[];
        completed: any[];
        cancelled: any[];
    };
    currentStatus: string;
    currentPage: number;
    totalPages: number;
    searchQuery: string;
}

export function OrdersPageClient({
    initialOrders,
    categorizedOrders,
    currentStatus,
    currentPage,
    totalPages,
    searchQuery,
}: OrdersPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchQuery);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [viewingOrder, setViewingOrder] = useState<any | null>(null);

    const statusCounts = {
        all: initialOrders.length,
        pending: categorizedOrders.pending.length,
        processing: categorizedOrders.processing.length,
        completed: categorizedOrders.completed.length,
        cancelled: categorizedOrders.cancelled.length,
    };

    const updateStatus = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("status", status);
        params.delete("page");
        router.push(`/admin/orders?${params.toString()}`);
    };

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`/admin/orders?${params.toString()}`);
    };

    const handleStatusUpdate = async (orderId: string, status: "pending" | "processing" | "completed" | "cancelled") => {
        const result = await updateOrderStatus(orderId, status);
        if (result.success) {
            toast.success(`Order status updated to ${status}`);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update order status");
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedOrders.length === 0) {
            toast.error("Please select at least one order");
            return;
        }

        try {
            if (action === "mark-processing") {
                for (const orderId of selectedOrders) {
                    await updateOrderStatus(orderId, "processing");
                }
                toast.success(`Marked ${selectedOrders.length} order(s) as processing`);
            } else if (action === "mark-completed") {
                for (const orderId of selectedOrders) {
                    await updateOrderStatus(orderId, "completed");
                }
                toast.success(`Marked ${selectedOrders.length} order(s) as completed`);
            } else if (action === "mark-cancelled") {
                for (const orderId of selectedOrders) {
                    await updateOrderStatus(orderId, "cancelled");
                }
                toast.success(`Cancelled ${selectedOrders.length} order(s)`);
            }
            setSelectedOrders([]);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update orders");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            processing: "bg-blue-100 text-blue-700 border-blue-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
    };

    const formatCurrency = (amount: string | number) => {
        return `Rs. ${parseFloat(amount.toString()).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <FiDownload className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1">
                {[
                    { key: "all", label: "All Orders", count: statusCounts.all },
                    { key: "pending", label: "Pending", count: statusCounts.pending },
                    { key: "processing", label: "Processing", count: statusCounts.processing },
                    { key: "completed", label: "Completed", count: statusCounts.completed },
                    { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => updateStatus(tab.key)}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            currentStatus === tab.key
                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>{tab.label}</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    currentStatus === tab.key
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {tab.count}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by order number, customer name, or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleSearch}>
                                Search
                            </Button>
                        </div>
                        
                        {/* Bulk Actions */}
                        {selectedOrders.length > 0 && (
                            <Alert>
                                <AlertDescription className="flex items-center justify-between">
                                    <span>{selectedOrders.length} order(s) selected</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleBulkAction("mark-processing")}
                                        >
                                            Mark as Processing
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleBulkAction("mark-completed")}
                                        >
                                            Mark as Completed
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleBulkAction("mark-cancelled")}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Cancel Orders
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedOrders([])}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.length === initialOrders.length && initialOrders.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedOrders(initialOrders.map((o: any) => o.id));
                                            } else {
                                                setSelectedOrders([]);
                                            }
                                        }}
                                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialOrders.length > 0 ? (
                                initialOrders.map((order: any) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedOrders([...selectedOrders, order.id]);
                                                    } else {
                                                        setSelectedOrders(selectedOrders.filter((id) => id !== order.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                            />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="font-semibold text-gray-900 hover:text-pink-600"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.user?.name || order.guestName || "Guest"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.user?.email || order.guestEmail || "No email"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleTimeString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${getStatusBadge(order.status)} border`}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <FiMoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                                                        <FiEye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {order.status === "pending" && (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "processing")}>
                                                            <FiClock className="w-4 h-4 mr-2" />
                                                            Mark as Processing
                                                        </DropdownMenuItem>
                                                    )}
                                                    {order.status === "processing" && (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "completed")}>
                                                            <FiCheck className="w-4 h-4 mr-2" />
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(order.status === "pending" || order.status === "processing") && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusUpdate(order.id, "cancelled")}
                                                            className="text-red-600"
                                                        >
                                                            <FiX className="w-4 h-4 mr-2" />
                                                            Cancel Order
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiClock className="w-12 h-12 text-gray-400" />
                                            <p className="text-gray-500 font-medium">No orders found</p>
                                            <p className="text-sm text-gray-400">
                                                {currentStatus !== "all"
                                                    ? `No ${currentStatus} orders at the moment.`
                                                    : "Start receiving orders to see them here."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("page", (currentPage - 1).toString());
                                        router.push(`/admin/orders?${params.toString()}`);
                                    }}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("page", (currentPage + 1).toString());
                                        router.push(`/admin/orders?${params.toString()}`);
                                    }}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <OrderDetailDialog
                open={!!viewingOrder}
                onOpenChange={(open) => !open && setViewingOrder(null)}
                order={viewingOrder}
                onStatusUpdate={() => {
                    router.refresh();
                }}
            />
        </div>
    );
}

