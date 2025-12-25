"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/server/users";
import { OrderCard } from "@/components/profile/OrderCard";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

interface OrdersTabProps {
    userId: string;
}

export function OrdersTab({ userId }: OrdersTabProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const result = await getUserOrders();
                if (result.success) {
                    setOrders(result.orders || []);
                } else {
                    setError(result.error || "Failed to load orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("An error occurred while loading orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <FiPackage className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
                    <FiShoppingBag className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet. Start shopping to see your order history here.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-rose-700 transition-colors"
                >
                    Start Shopping
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Order History ({orders.length})
                </h2>
                <p className="text-sm text-gray-600">
                    View all your past and current orders
                </p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}

