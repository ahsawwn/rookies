"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderFormDialog } from "@/components/admin/PurchaseOrderFormDialog";
import { updatePurchaseOrderStatus } from "@/server/purchases";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiPlus, FiMoreVertical, FiSearch, FiEye, FiCheck, FiX, FiShoppingBag } from "react-icons/fi";

interface PurchaseOrder {
    id: string;
    orderNumber: string;
    supplierId: string;
    supplier?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
    };
    totalAmount: string;
    status: "pending" | "received" | "cancelled";
    createdAt: Date;
    items?: Array<{
        id: string;
        productId: string;
        product?: {
            id: string;
            name: string;
        };
        quantity: number;
        unitCost: string;
        subtotal: string;
    }>;
}

interface PurchasesPageClientProps {
    initialOrders: PurchaseOrder[];
}

export function PurchasesPageClient({ initialOrders }: PurchasesPageClientProps) {
    const router = useRouter();
    const [orders, setOrders] = useState(initialOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.supplier?.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const pendingOrders = useMemo(() => filteredOrders.filter(o => o.status === "pending"), [filteredOrders]);
    const receivedOrders = useMemo(() => filteredOrders.filter(o => o.status === "received"), [filteredOrders]);
    const cancelledOrders = useMemo(() => filteredOrders.filter(o => o.status === "cancelled"), [filteredOrders]);

    const formatCurrency = (amount: string | number) => {
        return `Rs. ${parseFloat(amount.toString()).toFixed(2)}`;
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            received: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
    };

    const handleStatusUpdate = async (orderId: string, status: "pending" | "received" | "cancelled") => {
        const result = await updatePurchaseOrderStatus(orderId, status);
        if (result.success) {
            toast.success("Purchase order status updated");
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update status");
        }
    };

    const handleDialogSuccess = () => {
        setOrderDialogOpen(false);
        router.refresh();
    };

    const renderOrdersTable = (ordersToShow: PurchaseOrder[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordersToShow.length > 0 ? (
                        ordersToShow.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{order.supplier?.name || "Unknown"}</div>
                                        {order.supplier?.email && (
                                            <div className="text-sm text-gray-500">{order.supplier.email}</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.items ? `${order.items.length} item(s)` : "N/A"}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {formatCurrency(order.totalAmount)}
                                </TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusBadge(order.status)}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
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
                                                <>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "received")}>
                                                        <FiCheck className="w-4 h-4 mr-2" />
                                                        Mark as Received
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "cancelled")}>
                                                        <FiX className="w-4 h-4 mr-2" />
                                                        Cancel Order
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <FiShoppingBag className="w-12 h-12 text-gray-400" />
                                    <p className="text-gray-500 font-medium">No purchase orders found</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
                    <p className="text-gray-600 mt-1">Manage purchase orders and suppliers</p>
                </div>
                <Button
                    onClick={() => setOrderDialogOpen(true)}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    New Purchase Order
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search by order number or supplier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Orders Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({filteredOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending ({pendingOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="received">
                        Received ({receivedOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                        Cancelled ({cancelledOrders.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {renderOrdersTable(filteredOrders)}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                    {renderOrdersTable(pendingOrders)}
                </TabsContent>

                <TabsContent value="received" className="space-y-4">
                    {renderOrdersTable(receivedOrders)}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4">
                    {renderOrdersTable(cancelledOrders)}
                </TabsContent>
            </Tabs>

            {/* Purchase Order Form Dialog */}
            <PurchaseOrderFormDialog
                open={orderDialogOpen}
                onOpenChange={setOrderDialogOpen}
                onSuccess={handleDialogSuccess}
            />

            {/* Order Detail Dialog */}
            <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Purchase Order Details</DialogTitle>
                        <DialogDescription>
                            {viewingOrder?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>

                    {viewingOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Supplier</p>
                                    <p className="font-medium">{viewingOrder.supplier?.name}</p>
                                    {viewingOrder.supplier?.email && (
                                        <p className="text-sm text-gray-500">{viewingOrder.supplier.email}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <Badge className={getStatusBadge(viewingOrder.status)}>
                                        {viewingOrder.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-medium">
                                        {new Date(viewingOrder.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="font-bold text-lg">{formatCurrency(viewingOrder.totalAmount)}</p>
                                </div>
                            </div>

                            {viewingOrder.items && viewingOrder.items.length > 0 && (
                                <div className="space-y-2">
                                    <p className="font-medium">Items</p>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead>Unit Cost</TableHead>
                                                    <TableHead>Subtotal</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {viewingOrder.items.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.product?.name || "Unknown"}</TableCell>
                                                        <TableCell>{item.quantity}</TableCell>
                                                        <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                                                        <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

