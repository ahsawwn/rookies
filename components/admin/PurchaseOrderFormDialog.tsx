"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createPurchaseOrder, getAllSuppliers } from "@/server/purchases";
import { getProducts } from "@/server/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";

interface PurchaseOrderFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitCost: string;
    subtotal: number;
}

export function PurchaseOrderFormDialog({ open, onOpenChange, onSuccess }: PurchaseOrderFormDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [items, setItems] = useState<OrderItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unitCost, setUnitCost] = useState("");

    useEffect(() => {
        if (open) {
            loadSuppliers();
            loadProducts();
            setItems([]);
            setSelectedSupplier("");
        }
    }, [open]);

    const loadSuppliers = async () => {
        const result = await getAllSuppliers();
        if (result.success) {
            setSuppliers(result.suppliers);
        }
    };

    const loadProducts = async () => {
        const result = await getProducts({});
        if (result.success) {
            setProducts(result.products);
        }
    };

    const addItem = () => {
        if (!selectedProduct || !quantity || !unitCost) {
            toast.error("Please fill in all fields");
            return;
        }

        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        const qty = parseInt(quantity);
        const cost = parseFloat(unitCost);
        const subtotal = qty * cost;

        setItems([...items, {
            productId: selectedProduct,
            productName: product.name,
            quantity: qty,
            unitCost: unitCost,
            subtotal,
        }]);

        setSelectedProduct("");
        setQuantity("");
        setUnitCost("");
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSupplier) {
            toast.error("Please select a supplier");
            return;
        }
        if (items.length === 0) {
            toast.error("Please add at least one item");
            return;
        }

        setLoading(true);

        try {
            const result = await createPurchaseOrder({
                supplierId: selectedSupplier,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                })),
            });

            if (result.success) {
                toast.success("Purchase order created successfully");
                onOpenChange(false);
                onSuccess?.();
                router.refresh();
            } else {
                toast.error(result.error || "Failed to create purchase order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                        Create a new purchase order from a supplier
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier *</Label>
                        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id}>
                                        {supplier.name} {supplier.email && `(${supplier.email})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Add Items</Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Unit Cost (Rs.)"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                            />
                            <Button type="button" onClick={addItem} variant="outline">
                                <FiPlus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-2">
                            <Label>Order Items</Label>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Cost</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>Rs. {parseFloat(item.unitCost).toFixed(2)}</TableCell>
                                                <TableCell>Rs. {item.subtotal.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <FiTrash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-end pt-2">
                                <div className="text-lg font-bold">
                                    Total: Rs. {totalAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || items.length === 0}>
                            {loading ? "Creating..." : "Create Purchase Order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

