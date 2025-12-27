import { getAllPurchaseOrders } from "@/server/purchases";
import { PurchasesPageClient } from "@/components/admin/PurchasesPageClient";

export default async function PurchasesPage() {
    const ordersResult = await getAllPurchaseOrders();
    const orders = ordersResult.success 
        ? ordersResult.orders.map(order => ({
            ...order,
            supplier: order.supplier ? {
                ...order.supplier,
                email: order.supplier.email ?? undefined,
                phone: order.supplier.phone ?? undefined,
            } : undefined,
        }))
        : [];

    return <PurchasesPageClient initialOrders={orders} />;
}
