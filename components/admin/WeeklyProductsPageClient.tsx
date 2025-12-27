"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DataTable";
import { WeeklyProductFormDialog } from "./WeeklyProductFormDialog";
import { FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteWeeklyProduct } from "@/server/weekly-products";

interface WeeklyProduct {
    id: string;
    productId: string;
    startDate: Date;
    endDate: Date;
    product?: any;
}

interface WeeklyProductsPageClientProps {
    initialWeeklyProducts: WeeklyProduct[];
    initialProducts: any[];
}

export default function WeeklyProductsPageClient({
    initialWeeklyProducts,
    initialProducts,
}: WeeklyProductsPageClientProps) {
    const [weeklyProducts, setWeeklyProducts] = useState(initialWeeklyProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<WeeklyProduct | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this weekly product schedule?")) {
            return;
        }

        const result = await deleteWeeklyProduct(id);
        if (result.success) {
            setWeeklyProducts(weeklyProducts.filter((wp) => wp.id !== id));
            toast.success("Weekly product schedule deleted");
        } else {
            toast.error(result.error || "Failed to delete weekly product");
        }
    };

    const handleEdit = (product: WeeklyProduct) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = () => {
        // Refresh the page to get updated data
        window.location.reload();
    };

    const columns = [
        {
            key: "product",
            header: "Product",
            render: (row: WeeklyProduct) => row.product?.name || "Unknown Product",
        },
        {
            key: "startDate",
            header: "Start Date",
            render: (row: WeeklyProduct) => format(new Date(row.startDate), "MMM d, yyyy"),
        },
        {
            key: "endDate",
            header: "End Date",
            render: (row: WeeklyProduct) => format(new Date(row.endDate), "MMM d, yyyy"),
        },
        {
            key: "status",
            header: "Status",
            render: (row: WeeklyProduct) => {
                const now = new Date();
                const start = new Date(row.startDate);
                const end = new Date(row.endDate);
                if (now < start) return "Upcoming";
                if (now > end) return "Expired";
                return "Active";
            },
        },
        {
            key: "actions",
            header: "Actions",
            render: (row: WeeklyProduct) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weekly Products</h1>
                    <p className="text-gray-600 mt-1">Manage products available for specific weeks</p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Weekly Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Product Schedules</CardTitle>
                    <CardDescription>
                        Products scheduled to appear on the home page for specific weeks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {weeklyProducts.length > 0 ? (
                        <DataTable data={weeklyProducts} columns={columns} />
                    ) : (
                        <div className="text-center py-12">
                            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No weekly products scheduled yet</p>
                            <Button
                                onClick={() => setIsFormOpen(true)}
                                variant="outline"
                            >
                                <FiPlus className="w-4 h-4 mr-2" />
                                Add Your First Weekly Product
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <WeeklyProductFormDialog
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                products={initialProducts}
                editingProduct={editingProduct}
            />
        </div>
    );
}

