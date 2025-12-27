"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockAdjustmentDialog } from "@/components/admin/StockAdjustmentDialog";
import { FiPackage, FiSearch, FiAlertTriangle, FiCheckCircle, FiXCircle, FiPlus, FiMinus } from "react-icons/fi";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    image?: string;
    category?: string;
    stock: number;
}

interface InventoryPageClientProps {
    initialProducts: Product[];
}

export function InventoryPageClient({ initialProducts }: InventoryPageClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [stockAdjustmentOpen, setStockAdjustmentOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter((cat): cat is string => Boolean(cat)));
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);

    const lowStockProducts = useMemo(() => filteredProducts.filter(p => p.stock < 10 && p.stock > 0), [filteredProducts]);
    const outOfStockProducts = useMemo(() => filteredProducts.filter(p => p.stock === 0), [filteredProducts]);
    const inStockProducts = useMemo(() => filteredProducts.filter(p => p.stock >= 10), [filteredProducts]);

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: "Out of Stock", color: "destructive", bg: "bg-red-100 text-red-700 border-red-200" };
        if (stock < 10) return { label: "Low Stock", color: "warning", bg: "bg-amber-100 text-amber-700 border-amber-200" };
        return { label: "In Stock", color: "success", bg: "bg-green-100 text-green-700 border-green-200" };
    };

    const getStockProgress = (stock: number) => {
        // Assuming max stock of 100 for progress calculation
        const maxStock = 100;
        return Math.min((stock / maxStock) * 100, 100);
    };

    const openStockAdjustment = (product: Product) => {
        setSelectedProduct(product);
        setStockAdjustmentOpen(true);
    };

    const handleStockUpdate = () => {
        setStockAdjustmentOpen(false);
        setSelectedProduct(null);
        // Refresh will be handled by the dialog
    };

    const renderProductsTable = (productsToShow: Product[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productsToShow.length > 0 ? (
                        productsToShow.map((product) => {
                            const status = getStockStatus(product.stock);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-500">ID: {product.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {product.category && (
                                            <Badge variant="outline">{product.category}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2 min-w-[200px]">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold">{product.stock} units</span>
                                                <span className="text-gray-500">Max: 100</span>
                                            </div>
                                            <Progress value={getStockProgress(product.stock)} className="h-2" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={status.bg}>
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openStockAdjustment(product)}
                                        >
                                            Adjust Stock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <FiPackage className="w-12 h-12 text-gray-400" />
                                    <p className="text-gray-500 font-medium">No products found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage product stock levels</p>
            </div>

            {/* Alerts */}
            {outOfStockProducts.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                    <FiXCircle className="w-4 h-4 text-red-600" />
                    <AlertTitle>Out of Stock Alert</AlertTitle>
                    <AlertDescription>
                        <strong>{outOfStockProducts.length} product(s)</strong> are currently out of stock and need immediate attention.
                    </AlertDescription>
                </Alert>
            )}

            {lowStockProducts.length > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                    <FiAlertTriangle className="w-4 h-4 text-amber-600" />
                    <AlertTitle>Low Stock Warning</AlertTitle>
                    <AlertDescription>
                        <strong>{lowStockProducts.length} product(s)</strong> have low stock (less than 10 units). Consider restocking soon.
                    </AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                        </div>
                        <FiPackage className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                <div className="p-4 bg-white border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">In Stock</p>
                            <p className="text-2xl font-bold text-green-700">{inStockProducts.length}</p>
                        </div>
                        <FiCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="p-4 bg-white border border-amber-200 rounded-lg bg-amber-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-amber-700">{lowStockProducts.length}</p>
                        </div>
                        <FiAlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                </div>
                <div className="p-4 bg-white border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-700">{outOfStockProducts.length}</p>
                        </div>
                        <FiXCircle className="w-8 h-8 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Products Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({filteredProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="in-stock">
                        In Stock ({inStockProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="low-stock">
                        Low Stock ({lowStockProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="out-of-stock">
                        Out of Stock ({outOfStockProducts.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {renderProductsTable(filteredProducts)}
                </TabsContent>

                <TabsContent value="in-stock" className="space-y-4">
                    {renderProductsTable(inStockProducts)}
                </TabsContent>

                <TabsContent value="low-stock" className="space-y-4">
                    {renderProductsTable(lowStockProducts)}
                </TabsContent>

                <TabsContent value="out-of-stock" className="space-y-4">
                    {renderProductsTable(outOfStockProducts)}
                </TabsContent>
            </Tabs>

            {/* Stock Adjustment Dialog */}
            <StockAdjustmentDialog
                open={stockAdjustmentOpen}
                onOpenChange={setStockAdjustmentOpen}
                product={selectedProduct}
                onSuccess={handleStockUpdate}
            />
        </div>
    );
}
