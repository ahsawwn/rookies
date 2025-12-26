"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { deleteProduct, toggleProductStatus } from "@/server/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical, FiSearch, FiFilter, FiDownload, FiCopy, FiEye } from "react-icons/fi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
    id: string;
    name: string;
    image: string;
    category: string;
    price: string;
    stock: number;
    isActive: boolean;
    isFeatured?: boolean;
    description?: string;
    shortDescription?: string;
    originalPrice?: string;
    calories?: number;
}

interface AdminProductsPageClientProps {
    initialProducts: Product[];
}

export function AdminProductsPageClient({ initialProducts }: AdminProductsPageClientProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [commandOpen, setCommandOpen] = useState(false);

    // Debug: Log products on mount
    useEffect(() => {
        console.log("[AdminProductsPageClient] Initial products:", initialProducts?.length || 0);
        if (initialProducts?.length === 0) {
            console.warn("[AdminProductsPageClient] No products received! Check database and server logs.");
        }
    }, [initialProducts]);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && product.isActive) ||
                (statusFilter === "inactive" && !product.isActive) ||
                (statusFilter === "low-stock" && product.stock < 10);
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, categoryFilter, statusFilter]);

    const activeProducts = useMemo(() => filteredProducts.filter(p => p.isActive), [filteredProducts]);
    const inactiveProducts = useMemo(() => filteredProducts.filter(p => !p.isActive), [filteredProducts]);
    const lowStockProducts = useMemo(() => filteredProducts.filter(p => p.stock < 10), [filteredProducts]);

    const formatCurrency = (amount: string | number) => {
        return `Rs. ${parseFloat(amount.toString()).toFixed(2)}`;
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const result = await deleteProduct(productId);
        if (result.success) {
            toast.success("Product deleted successfully");
            setProducts(products.filter((p) => p.id !== productId));
            router.refresh();
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
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update product status");
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedProducts.length === 0) {
            toast.error("Please select at least one product");
            return;
        }

        try {
            if (action === "activate") {
                for (const productId of selectedProducts) {
                    const product = products.find(p => p.id === productId);
                    if (product && !product.isActive) {
                        await toggleProductStatus(productId);
                    }
                }
                toast.success(`Activated ${selectedProducts.length} product(s)`);
            } else if (action === "deactivate") {
                for (const productId of selectedProducts) {
                    const product = products.find(p => p.id === productId);
                    if (product && product.isActive) {
                        await toggleProductStatus(productId);
                    }
                }
                toast.success(`Deactivated ${selectedProducts.length} product(s)`);
            } else if (action === "delete") {
                if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) return;
                for (const productId of selectedProducts) {
                    await deleteProduct(productId);
                }
                toast.success(`Deleted ${selectedProducts.length} product(s)`);
                setProducts(products.filter(p => !selectedProducts.includes(p.id)));
            }
            setSelectedProducts([]);
            router.refresh();
        } catch (error) {
            toast.error("Failed to perform bulk action");
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setProductDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setProductDialogOpen(false);
        setEditingProduct(null);
        router.refresh();
    };

    const renderProductsTable = (productsToShow: Product[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <input
                                type="checkbox"
                                checked={selectedProducts.length === productsToShow.length && productsToShow.length > 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedProducts(productsToShow.map(p => p.id));
                                    } else {
                                        setSelectedProducts([]);
                                    }
                                }}
                                className="rounded border-gray-300"
                            />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productsToShow.length > 0 ? (
                        productsToShow.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts([...selectedProducts, product.id]);
                                            } else {
                                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={product.image || "/placeholder.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            {product.isFeatured && (
                                                <Badge variant="outline" className="mt-1 text-xs">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                                        {product.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold">{formatCurrency(product.price)}</div>
                                    {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                                        <div className="text-xs text-gray-500 line-through">
                                            {formatCurrency(product.originalPrice)}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{product.stock}</span>
                                            {product.stock < 10 && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Low
                                                </Badge>
                                            )}
                                        </div>
                                        <Progress value={(product.stock / 100) * 100} className="h-1.5" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={product.isActive}
                                            onCheckedChange={() => handleToggleStatus(product.id)}
                                        />
                                        <Badge
                                            className={
                                                product.isActive
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                            }
                                        >
                                            {product.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <FiMoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                                <FiEdit className="w-4 h-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                navigator.clipboard.writeText(product.id);
                                                toast.success("Product ID copied");
                                            }}>
                                                <FiCopy className="w-4 h-4 mr-2" />
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600"
                                            >
                                                <FiTrash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <FiSearch className="w-12 h-12 text-gray-400" />
                                    <p className="text-gray-500 font-medium">
                                        {initialProducts.length === 0 
                                            ? "No products in database" 
                                            : "No products found"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {initialProducts.length === 0 
                                            ? "Add your first product using the button above" 
                                            : "Try adjusting your filters"}
                                    </p>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => setCommandOpen(true)}
                                    className="hidden md:flex"
                                >
                                    <FiSearch className="w-4 h-4 mr-2" />
                                    Search (⌘K)
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Quick search products</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setProductDialogOpen(true);
                        }}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <Alert>
                    <AlertDescription className="flex items-center justify-between">
                        <span>{selectedProducts.length} product(s) selected</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction("activate")}
                            >
                                Activate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction("deactivate")}
                            >
                                Deactivate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction("delete")}
                                className="text-red-600 hover:text-red-700"
                            >
                                Delete
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProducts([])}
                            >
                                Clear
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription>
                        <strong>{lowStockProducts.length} product(s)</strong> have low stock (less than 10 units)
                    </AlertDescription>
                </Alert>
            )}

            {/* Products Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({filteredProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        Active ({activeProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                        Inactive ({inactiveProducts.length})
                    </TabsTrigger>
                    <TabsTrigger value="low-stock">
                        Low Stock ({lowStockProducts.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {renderProductsTable(filteredProducts)}
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    {renderProductsTable(activeProducts)}
                </TabsContent>

                <TabsContent value="inactive" className="space-y-4">
                    {renderProductsTable(inactiveProducts)}
                </TabsContent>

                <TabsContent value="low-stock" className="space-y-4">
                    {renderProductsTable(lowStockProducts)}
                </TabsContent>
            </Tabs>

            {/* Product Form Dialog */}
            <ProductFormDialog
                open={productDialogOpen}
                onOpenChange={setProductDialogOpen}
                product={editingProduct}
                onSuccess={handleDialogSuccess}
            />

            {/* Command Palette */}
            <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search Products</DialogTitle>
                    </DialogHeader>
                    <Command>
                        <CommandInput placeholder="Search products..." />
                        <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup heading="Products">
                                {products.slice(0, 10).map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        onSelect={() => {
                                            openEditDialog(product);
                                            setCommandOpen(false);
                                        }}
                                    >
                                        {product.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </div>
    );
}
