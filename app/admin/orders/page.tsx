import { getAllOrders } from "@/server/orders";
import { OrdersPageClient } from "@/components/admin/OrdersPageClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const status = params.status || "all";
    const page = parseInt(params.page || "1");
    const search = params.search || "";

    const ordersResult = await getAllOrders(page, 20);
    const orders = ordersResult.success ? ordersResult.orders : [];
    const totalPages = ordersResult.success ? ordersResult.pagination.totalPages : 1;

    // Filter orders by status
    let filteredOrders = orders;
    if (status !== "all") {
        filteredOrders = orders.filter((order: any) => order.status === status);
    }

    // Filter by search term
    if (search) {
        filteredOrders = filteredOrders.filter((order: any) => {
            const searchLower = search.toLowerCase();
            return (
                order.orderNumber?.toLowerCase().includes(searchLower) ||
                order.user?.name?.toLowerCase().includes(searchLower) ||
                order.user?.email?.toLowerCase().includes(searchLower) ||
                order.guestName?.toLowerCase().includes(searchLower) ||
                order.guestEmail?.toLowerCase().includes(searchLower)
            );
        });
    }

    // Categorize orders
    const categorizedOrders = {
        pending: orders.filter((o: any) => o.status === "pending"),
        processing: orders.filter((o: any) => o.status === "processing"),
        completed: orders.filter((o: any) => o.status === "completed"),
        cancelled: orders.filter((o: any) => o.status === "cancelled"),
    };

    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            }
        >
            <OrdersPageClient
                initialOrders={filteredOrders}
                categorizedOrders={categorizedOrders}
                currentStatus={status}
                currentPage={page}
                totalPages={totalPages}
                searchQuery={search}
            />
        </Suspense>
    );
}

