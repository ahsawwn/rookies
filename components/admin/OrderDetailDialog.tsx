"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateOrderStatus } from "@/server/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiCheck, FiX, FiClock, FiTruck, FiPackage, FiPrinter, FiMail } from "react-icons/fi";
import Image from "next/image";

interface OrderDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: any | null;
    onStatusUpdate?: () => void;
}

export function OrderDetailDialog({ open, onOpenChange, order, onStatusUpdate }: OrderDetailDialogProps) {
    const router = useRouter();

    if (!order) return null;

    const formatCurrency = (amount: string | number | undefined | null) => {
        if (amount === undefined || amount === null) {
            return 'Rs. 0.00';
        }
        const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numValue)) {
            return 'Rs. 0.00';
        }
        return `Rs. ${numValue.toFixed(2)}`;
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

    const handleStatusUpdate = async (newStatus: "pending" | "processing" | "completed" | "cancelled") => {
        const result = await updateOrderStatus(order.id, newStatus);
        if (result.success) {
            toast.success(`Order status updated to ${newStatus}`);
            onStatusUpdate?.();
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update order status");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusTimeline = () => {
        const timeline = [];
        if (order.createdAt) {
            timeline.push({ status: "Order Placed", date: new Date(order.createdAt), completed: true });
        }
        if (order.status === "processing" || order.status === "completed") {
            timeline.push({ status: "Processing", date: new Date(), completed: true });
        }
        if (order.status === "completed") {
            timeline.push({ status: "Completed", date: new Date(), completed: true });
        }
        if (order.status === "cancelled") {
            timeline.push({ status: "Cancelled", date: new Date(), completed: true });
        }
        return timeline;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                                {new Date(order.createdAt).toLocaleString()}
                            </DialogDescription>
                        </div>
                        <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium">{order.user?.name || order.guestName || "Guest"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{order.user?.email || order.guestEmail || "N/A"}</p>
                            </div>
                            {order.user?.phone || order.guestPhone ? (
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">{order.user?.phone || order.guestPhone}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Delivery Information</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                {order.deliveryType === "delivery" ? (
                                    <FiTruck className="w-5 h-5 text-pink-600" />
                                ) : (
                                    <FiPackage className="w-5 h-5 text-pink-600" />
                                )}
                                <span className="font-medium">
                                    {order.deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"}
                                </span>
                            </div>
                            {order.deliveryType === "delivery" && order.deliveryAddress && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>{order.deliveryAddress.street}</p>
                                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                                    <p>{order.deliveryAddress.postalCode}</p>
                                </div>
                            )}
                            {order.deliveryType === "pickup" && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Pickup Name: {order.pickupName || "N/A"}</p>
                                    <p>Pickup Phone: {order.pickupPhone || "N/A"}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-semibold">Product</th>
                                        <th className="text-center p-3 text-sm font-semibold">Quantity</th>
                                        <th className="text-right p-3 text-sm font-semibold">Price</th>
                                        <th className="text-right p-3 text-sm font-semibold">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item: any) => (
                                            <tr key={item.id} className="border-t">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {item.product?.image && (
                                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                                    <Image
                                                                        src={item.product.image}
                                                                        alt={item.product.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
                                                                <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                                                    <td className="p-3 text-right font-semibold">
                                                        {formatCurrency(item.price ? parseFloat(String(item.price)) * item.quantity : 0)}
                                                    </td>
                                                </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                No items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={3} className="p-3 text-right font-semibold">Total</td>
                                        <td className="p-3 text-right font-bold text-lg text-pink-600">
                                            {formatCurrency(order.totalAmount || 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Order Status</h3>
                        <div className="space-y-3">
                            {getStatusTimeline().map((step, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                    }`}>
                                        {step.completed ? (
                                            <FiCheck className="w-4 h-4" />
                                        ) : (
                                            <FiClock className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{step.status}</p>
                                        <p className="text-sm text-gray-500">
                                            {step.date.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {order.status === "pending" && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusUpdate("processing")}
                                    >
                                        <FiClock className="w-4 h-4 mr-2" />
                                        Mark as Processing
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusUpdate("cancelled")}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <FiX className="w-4 h-4 mr-2" />
                                        Cancel Order
                                    </Button>
                                </>
                            )}
                            {order.status === "processing" && (
                                <Button
                                    variant="default"
                                    onClick={() => handleStatusUpdate("completed")}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <FiCheck className="w-4 h-4 mr-2" />
                                    Mark as Completed
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handlePrint}>
                                <FiPrinter className="w-4 h-4 mr-2" />
                                Print Invoice
                            </Button>
                            <Button variant="outline">
                                <FiMail className="w-4 h-4 mr-2" />
                                Send Email
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

