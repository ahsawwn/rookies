import { getAllPurchaseOrders } from "@/server/purchases";
import { PurchasesPageClient } from "@/components/admin/PurchasesPageClient";

export default async function PurchasesPage() {
    const ordersResult = await getAllPurchaseOrders();
    const orders = ordersResult.success ? ordersResult.orders : [];

    return <PurchasesPageClient initialOrders={orders} />;
}
