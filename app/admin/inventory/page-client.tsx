"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminCard } from "@/components/admin/Card";
import { AdminButton } from "@/components/admin/Button";
import { Badge } from "@/components/ui/badge";
import { FiPackage } from "react-icons/fi";

interface Product {
    id: string;
    name: string;
    stock: number;
}

interface InventoryPageClientProps {
    initialProducts: Product[];
}

export function InventoryPageClient({ initialProducts }: InventoryPageClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);

    const lowStockProducts = products.filter((p) => p.stock < 10);

    const columns = [
        {
            key: "name",
            header: "Product Name",
        },
        {
            key: "stock",
            header: "Current Stock",
            render: (product: Product) => (
                <span className={product.stock < 10 ? "text-red-600 font-semibold" : "text-gray-900"}>
                    {product.stock} units
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (product: Product) => (
                <Badge
                    className={
                        product.stock === 0
                            ? "bg-red-100 text-red-700 border-red-200"
                            : product.stock < 10
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-green-100 text-green-700 border-green-200"
                    }
                >
                    {product.stock === 0
                        ? "Out of Stock"
                        : product.stock < 10
                        ? "Low Stock"
                        : "In Stock"}
                </Badge>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (product: Product) => (
                <AdminButton variant="outline" onClick={() => {
                    // TODO: Open stock adjustment modal
                    alert(`Adjust stock for ${product.name}`);
                }}>
                    Adjust Stock
                </AdminButton>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage product stock levels</p>
            </div>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
                <AdminCard
                    header={
                        <div className="flex items-center gap-2">
                            <FiPackage className="w-5 h-5 text-amber-600" />
                            <h2 className="text-lg font-semibold text-amber-900">
                                Low Stock Alerts ({lowStockProducts.length})
                            </h2>
                        </div>
                    }
                >
                    <div className="space-y-2">
                        {lowStockProducts.slice(0, 5).map((product) => (
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
                                <AdminButton
                                    variant="outline"
                                    onClick={() => {
                                        // TODO: Open restock modal
                                        alert(`Restock ${product.name}`);
                                    }}
                                >
                                    Restock
                                </AdminButton>
                            </div>
                        ))}
                    </div>
                </AdminCard>
            )}

            {/* Inventory Table */}
            <AdminCard>
                <DataTable
                    data={products}
                    columns={columns}
                    pagination={{
                        page,
                        pageSize: 10,
                        total: products.length,
                        onPageChange: setPage,
                    }}
                />
            </AdminCard>
        </div>
    );
}

