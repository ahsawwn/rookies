import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers, FiArrowRight, FiAlertTriangle, FiClock } from "react-icons/fi";
import { DashboardStat } from "@/components/admin/DashboardStats";
import { SalesChart } from "@/components/admin/SalesChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getAllOrders } from "@/server/orders";
import { getProducts } from "@/server/products";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminDashboard() {
    const ordersResult = await getAllOrders(1, 50);
    const orders = ordersResult.success ? ordersResult.orders : [];
    const productsResult = await getProducts({ limit: 50 });
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

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayOrders = orders.filter(
        (order: any) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= yesterday && orderDate < today;
        }
    );
    const yesterdaySales = yesterdayOrders.reduce(
        (sum: number, order: any) => sum + parseFloat(order.totalAmount),
        0
    );

    const salesChange = yesterdaySales > 0
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
        : todaySales > 0 ? 100 : 0;

    const pendingOrders = orders.filter((order: any) => order.status === "pending");
    const processingOrders = orders.filter((order: any) => order.status === "processing");
    const lowStockProducts = products.filter((p: any) => p.stock < 10);
    const outOfStockProducts = products.filter((p: any) => p.stock === 0);

    // Generate sales data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
    });

    const salesData = last7Days.map(date => {
        const dayOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
        });
        const sales = dayOrders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount), 0);
        return {
            date: date.toISOString(),
            sales,
        };
    });

    const stats = {
        todaySales,
        todaySalesChange: salesChange,
        totalOrders: orders.length,
        totalOrdersChange: 0, // TODO: Calculate from previous period
        totalProducts: products.length,
        totalProductsChange: 0, // TODO: Calculate from previous period
        totalCustomers: new Set(orders.map((o: any) => o.userId || o.guestEmail).filter(Boolean)).size,
        totalCustomersChange: 0, // TODO: Calculate from previous period
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/orders">
                        <Button variant="outline">
                            View All Orders
                            <FiArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/admin/pos">
                        <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            Open POS
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Alerts */}
            {outOfStockProducts.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                    <FiAlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertTitle>Out of Stock Alert</AlertTitle>
                    <AlertDescription>
                        <strong>{outOfStockProducts.length} product(s)</strong> are out of stock.{" "}
                        <Link href="/admin/inventory" className="underline font-medium">
                            Manage inventory
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {pendingOrders.length > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                    <FiClock className="w-4 h-4 text-amber-600" />
                    <AlertTitle>Pending Orders</AlertTitle>
                    <AlertDescription>
                        <strong>{pendingOrders.length} order(s)</strong> are pending.{" "}
                        <Link href="/admin/orders?status=pending" className="underline font-medium">
                            Review orders
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Today's Sales"
                    value={`Rs. ${stats.todaySales.toFixed(2)}`}
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
                <SalesChart data={salesData} />

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Link href="/admin/orders" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                                View All
                            </Link>
                        </div>
                        <CardDescription>Latest customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {orders.slice(0, 5).length > 0 ? (
                                orders.slice(0, 5).map((order: any) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 group-hover:text-pink-600">
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.user?.name || order.guestName || order.user?.email || order.guestEmail || "Guest"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                Rs. {parseFloat(order.totalAmount).toFixed(2)}
                                            </p>
                                            <Badge
                                                className={
                                                    order.status === "pending"
                                                        ? "bg-amber-100 text-amber-700 border-amber-200"
                                                        : order.status === "completed"
                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                        : order.status === "processing"
                                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                                        : "bg-gray-100 text-gray-700 border-gray-200"
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
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Low Stock Alerts</CardTitle>
                                <Badge variant="destructive">{lowStockProducts.length}</Badge>
                            </div>
                            <CardDescription>Products that need restocking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {lowStockProducts.slice(0, 5).map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-amber-700">
                                                Only {product.stock} units remaining
                                            </p>
                                        </div>
                                        <Link href="/admin/inventory">
                                            <Button variant="outline" size="sm">
                                                Restock
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                                {lowStockProducts.length > 5 && (
                                    <Link href="/admin/inventory">
                                        <Button variant="ghost" className="w-full">
                                            View All ({lowStockProducts.length})
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pending Orders */}
                {pendingOrders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Pending Orders</CardTitle>
                                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                                    {pendingOrders.length}
                                </Badge>
                            </div>
                            <CardDescription>Orders awaiting processing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pendingOrders.slice(0, 5).map((order: any) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-sm text-blue-700">
                                                {order.user?.name || order.guestName || order.user?.email || order.guestEmail || "Guest"} - Rs.{" "}
                                                {parseFloat(order.totalAmount).toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="text-xs text-blue-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </Link>
                                ))}
                                {pendingOrders.length > 5 && (
                                    <Link href="/admin/orders?status=pending">
                                        <Button variant="ghost" className="w-full">
                                            View All ({pendingOrders.length})
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/admin/products">
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <FiPackage className="w-6 h-6 mb-2" />
                                <span>Add Product</span>
                            </Button>
                        </Link>
                        <Link href="/admin/pos">
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <FiShoppingCart className="w-6 h-6 mb-2" />
                                <span>Open POS</span>
                            </Button>
                        </Link>
                        <Link href="/admin/purchases">
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <FiShoppingCart className="w-6 h-6 mb-2" />
                                <span>New Purchase</span>
                            </Button>
                        </Link>
                        <Link href="/admin/accounting">
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <FiDollarSign className="w-6 h-6 mb-2" />
                                <span>Add Transaction</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
