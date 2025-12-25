"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { AdminButton } from "@/components/admin/Button";
import { AdminCard } from "@/components/admin/Card";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { deleteProduct, toggleProductStatus } from "@/server/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    image: string;
    category: string;
    price: string;
    stock: number;
    isActive: boolean;
}

interface AdminProductsPageClientProps {
    initialProducts: Product[];
}

export function AdminProductsPageClient({ initialProducts }: AdminProductsPageClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const router = useRouter();

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const result = await deleteProduct(productId);
        if (result.success) {
            toast.success("Product deleted successfully");
            setProducts(products.filter((p) => p.id !== productId));
        } else {
            toast.error(result.error || "Failed to delete product");
        }
    };

    const handleToggleStatus = async (productId: string) => {
        const result = await toggleProductStatus(productId);
        if (result.success) {
            toast.success("Product status updated");
            setProducts(
                products.map((p) =>
                    p.id === productId ? { ...p, isActive: !p.isActive } : p
                )
            );
        } else {
            toast.error(result.error || "Failed to update product status");
        }
    };

    const columns = [
        {
            key: "image",
            header: "Image",
            render: (product: Product) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            ),
        },
        {
            key: "name",
            header: "Product Name",
            sortable: true,
        },
        {
            key: "category",
            header: "Category",
            render: (product: Product) => (
                <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                    {product.category}
                </Badge>
            ),
        },
        {
            key: "price",
            header: "Price",
            render: (product: Product) => `$${parseFloat(product.price).toFixed(2)}`,
        },
        {
            key: "stock",
            header: "Stock",
            render: (product: Product) => (
                <span className={product.stock < 10 ? "text-red-600 font-semibold" : "text-gray-900"}>
                    {product.stock}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (product: Product) => (
                <Badge
                    className={
                        product.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                >
                    {product.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (product: Product) => (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                        <AdminButton variant="outline" icon={<FiEdit className="w-4 h-4" />} />
                    </Link>
                    <AdminButton
                        variant="outline"
                        onClick={() => handleToggleStatus(product.id)}
                        icon={
                            product.isActive ? (
                                <FiTrash2 className="w-4 h-4" />
                            ) : (
                                <FiEdit className="w-4 h-4" />
                            )
                        }
                    />
                    <AdminButton
                        variant="danger"
                        icon={<FiTrash2 className="w-4 h-4" />}
                        onClick={() => handleDelete(product.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <AdminButton variant="primary" icon={<FiPlus className="w-4 h-4" />}>
                        Add Product
                    </AdminButton>
                </Link>
            </div>

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

