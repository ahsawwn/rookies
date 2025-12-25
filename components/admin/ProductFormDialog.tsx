"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProduct, updateProduct } from "@/server/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
    id?: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: string;
    originalPrice?: string;
    image: string;
    images?: string[];
    category: string;
    calories?: number;
    stock: number;
    isFeatured?: boolean;
    isActive?: boolean;
}

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onSuccess?: () => void;
}

const categories = [
    "cookies",
    "cakes",
    "cupcakes",
    "shakes",
    "breads",
    "croissants",
    "other"
];

export function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Product>({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        originalPrice: "",
        image: "",
        images: [],
        category: "cookies",
        calories: undefined,
        stock: 0,
        isFeatured: false,
        isActive: true,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                shortDescription: product.shortDescription || "",
                price: product.price || "",
                originalPrice: product.originalPrice || "",
                image: product.image || "",
                images: product.images || [],
                category: product.category || "cookies",
                calories: product.calories || undefined,
                stock: product.stock || 0,
                isFeatured: product.isFeatured || false,
                isActive: product.isActive !== undefined ? product.isActive : true,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                shortDescription: "",
                price: "",
                originalPrice: "",
                image: "",
                images: [],
                category: "cookies",
                calories: undefined,
                stock: 0,
                isFeatured: false,
                isActive: true,
            });
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                name: formData.name,
                description: formData.description || undefined,
                shortDescription: formData.shortDescription || undefined,
                price: formData.price,
                originalPrice: formData.originalPrice || undefined,
                image: formData.image,
                images: formData.images || undefined,
                category: formData.category,
                calories: formData.calories || undefined,
                stock: formData.stock,
                isFeatured: formData.isFeatured,
            };

            if (product?.id) {
                const result = await updateProduct(product.id, {
                    ...data,
                    isActive: formData.isActive,
                });
                if (result.success) {
                    toast.success("Product updated successfully");
                    onOpenChange(false);
                    onSuccess?.();
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to update product");
                }
            } else {
                const result = await createProduct(data);
                if (result.success) {
                    toast.success("Product created successfully");
                    onOpenChange(false);
                    onSuccess?.();
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to create product");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Update product information" : "Create a new product for your catalog"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Chocolate Chip Cookies"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (Rs.) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Original Price */}
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                            <Input
                                id="originalPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.originalPrice || ""}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value || undefined })}
                                placeholder="0.00"
                            />
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity *</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                                required
                            />
                        </div>

                        {/* Calories */}
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input
                                id="calories"
                                type="number"
                                min="0"
                                value={formData.calories || ""}
                                onChange={(e) => setFormData({ ...formData, calories: e.target.value ? parseInt(e.target.value) : undefined })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL *</Label>
                        <Input
                            id="image"
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        {formData.image && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mt-2">
                                <Image
                                    src={formData.image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <Textarea
                            id="shortDescription"
                            value={formData.shortDescription || ""}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            placeholder="Brief description (max 500 characters)"
                            rows={2}
                            maxLength={500}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed product description"
                            rows={4}
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                            />
                            <Label htmlFor="isFeatured">Featured Product</Label>
                        </div>
                        {product && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

