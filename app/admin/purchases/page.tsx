import { AdminCard } from "@/components/admin/Card";
import { AdminButton } from "@/components/admin/Button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { FiPlus, FiShoppingBag } from "react-icons/fi";

export default function PurchasesPage() {
    // Mock data - replace with real data
    const purchaseOrders: any[] = [];

    const columns = [
        {
            key: "orderNumber",
            header: "Order Number",
        },
        {
            key: "supplier",
            header: "Supplier",
            render: (order: any) => order.supplierName || "N/A",
        },
        {
            key: "totalAmount",
            header: "Total Amount",
            render: (order: any) => `$${parseFloat(order.totalAmount || "0").toFixed(2)}`,
        },
        {
            key: "status",
            header: "Status",
            render: (order: any) => (
                <Badge
                    className={
                        order.status === "received"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : order.status === "pending"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-red-100 text-red-700 border-red-200"
                    }
                >
                    {order.status || "pending"}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            header: "Date",
            render: (order: any) =>
                new Date(order.createdAt || Date.now()).toLocaleDateString(),
        },
        {
            key: "actions",
            header: "Actions",
            render: (order: any) => (
                <AdminButton variant="outline" onClick={() => {}}>
                    View
                </AdminButton>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
                    <p className="text-gray-600 mt-1">Manage purchase orders and suppliers</p>
                </div>
                <AdminButton variant="primary" icon={<FiPlus className="w-4 h-4" />}>
                    New Purchase Order
                </AdminButton>
            </div>

            <AdminCard>
                {purchaseOrders.length > 0 ? (
                    <DataTable
                        data={purchaseOrders}
                        columns={columns}
                        pagination={{
                            page: 1,
                            pageSize: 10,
                            total: purchaseOrders.length,
                            onPageChange: () => {},
                        }}
                    />
                ) : (
                    <div className="text-center py-12">
                        <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No purchase orders yet</p>
                        <AdminButton variant="primary" className="mt-4" icon={<FiPlus className="w-4 h-4" />}>
                            Create First Purchase Order
                        </AdminButton>
                    </div>
                )}
            </AdminCard>
        </div>
    );
}

