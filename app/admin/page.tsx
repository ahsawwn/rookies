import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from "react-icons/fi";
import { DashboardStat } from "@/components/admin/DashboardStats";
import { SalesChart } from "@/components/admin/SalesChart";
import { AdminCard } from "@/components/admin/Card";
import { getAllOrders } from "@/server/orders";
import { getProducts } from "@/server/products";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
    const ordersResult = await getAllOrders();
    const orders = ordersResult.success ? ordersResult.orders : [];
    const productsResult = await getProducts({});
    const products = productsResult.success ? productsResult.products : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(
        (order: any) => new Date(order.createdAt) >= today
    );
    const todaySales = todayOrders.reduce(
        (sum: number, order: any) => sum + parseFloat(order.totalAmount),
        0
    );
    const pendingOrders = orders.filter((order: any) => order.status === "pending");
    const lowStockProducts = products.filter((p: any) => p.stock < 10);

    const mockSalesData = [
        { date: "2024-01-01", sales: 1200 },
        { date: "2024-01-02", sales: 1500 },
        { date: "2024-01-03", sales: 1800 },
        { date: "2024-01-04", sales: 1400 },
        { date: "2024-01-05", sales: 2000 },
        { date: "2024-01-06", sales: 1600 },
        { date: "2024-01-07", sales: 1900 },
    ];

    const stats = {
        todaySales,
        todaySalesChange: 12.5, // TODO: Calculate from previous day
        totalOrders: orders.length,
        totalOrdersChange: 8.3, // TODO: Calculate change
        totalProducts: products.length,
        totalProductsChange: 5.2, // TODO: Calculate change
        totalCustomers: new Set(orders.map((o: any) => o.userId)).size,
        totalCustomersChange: 15.7, // TODO: Calculate change
    };
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Today's Sales"
                    value={`$${stats.todaySales.toFixed(2)}`}
                    change={stats.todaySalesChange}
                    icon={<FiDollarSign className="w-6 h-6" />}
                    color="green"
                />
                <DashboardStat
                    title="Total Orders"
                    value={stats.totalOrders}
                    change={stats.totalOrdersChange}
                    icon={<FiShoppingCart className="w-6 h-6" />}
                    color="blue"
                />
                <DashboardStat
                    title="Products"
                    value={stats.totalProducts}
                    change={stats.totalProductsChange}
                    icon={<FiPackage className="w-6 h-6" />}
                    color="pink"
                />
                <DashboardStat
                    title="Customers"
                    value={stats.totalCustomers}
                    change={stats.totalCustomersChange}
                    icon={<FiUsers className="w-6 h-6" />}
                    color="amber"
                />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart data={mockSalesData} />

                {/* Recent Orders */}
                <AdminCard
                    header={
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-sm text-pink-600 hover:text-pink-700">
                                View All
                            </Link>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        {orders.slice(0, 5).length > 0 ? (
                            orders.slice(0, 5).map((order: any) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-600">
                                            {order.user?.name || order.user?.email || "Guest"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${parseFloat(order.totalAmount).toFixed(2)}
                                        </p>
                                        <Badge
                                            className={
                                                order.status === "pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : order.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No orders yet</p>
                        )}
                    </div>
                </AdminCard>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <AdminCard
                    header={
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Low Stock Alerts ({lowStockProducts.length})
                            </h3>
                            <Link href="/admin/inventory" className="text-sm text-pink-600 hover:text-pink-700">
                                Manage Inventory
                            </Link>
                        </div>
                    }
                >
                    <div className="space-y-3">
                        {lowStockProducts.slice(0, 5).map((product: any) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-amber-700">
                                        Only {product.stock} units remaining
                                    </p>
                                </div>
                                <Link href="/admin/inventory">
                                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                                        Restock
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </AdminCard>
            )}

            {/* Pending Orders Alert */}
            {pendingOrders.length > 0 && (
                <AdminCard
                    header={
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pending Orders ({pendingOrders.length})
                            </h3>
                            <Link href="/admin/orders?status=pending" className="text-sm text-pink-600 hover:text-pink-700">
                                View All
                            </Link>
                        </div>
                    }
                >
                    <div className="space-y-3">
                        {pendingOrders.slice(0, 5).map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                    <p className="text-sm text-blue-700">
                                        {order.user?.name || order.user?.email || "Guest"} - $
                                        {parseFloat(order.totalAmount).toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-xs text-blue-600">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </Link>
                        ))}
                    </div>
                </AdminCard>
            )}
        </div>
    );
}

