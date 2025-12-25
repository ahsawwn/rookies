"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiPackage, FiCalendar, FiDollarSign } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface OrderCardProps {
    order: {
        id: string;
        orderNumber: string;
        totalAmount: string;
        status: "pending" | "processing" | "completed" | "cancelled";
        createdAt: Date;
    };
}

export function OrderCard({ order }: OrderCardProps) {
    const statusConfig = {
        pending: {
            label: "Pending",
            className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        },
        processing: {
            label: "Processing",
            className: "bg-blue-100 text-blue-700 border-blue-200",
        },
        completed: {
            label: "Completed",
            className: "bg-green-100 text-green-700 border-green-200",
        },
        cancelled: {
            label: "Cancelled",
            className: "bg-red-100 text-red-700 border-red-200",
        },
    };

    const config = statusConfig[order.status];

    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(order.totalAmount));

    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card className="hover:shadow-lg transition-shadow border-pink-100">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <FiPackage className="w-5 h-5 text-pink-600" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <FiCalendar className="w-3 h-3" />
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4 text-gray-600" />
                            <span className="text-lg font-bold text-gray-900">{formattedAmount}</span>
                        </div>
                        <Badge className={cn("font-medium", config.className)}>
                            {config.label}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

