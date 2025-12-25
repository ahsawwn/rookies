"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProduct } from "@/server/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    stock: number;
}

interface StockAdjustmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSuccess?: () => void;
}

export function StockAdjustmentDialog({ open, onOpenChange, product, onSuccess }: StockAdjustmentDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState<"set" | "add" | "subtract">("set");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (product && open) {
            setQuantity(product.stock.toString());
            setReason("");
            setAdjustmentType("set");
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);

        try {
            const qty = parseInt(quantity);
            if (isNaN(qty) || qty < 0) {
                toast.error("Please enter a valid quantity");
                setLoading(false);
                return;
            }

            let newStock = product.stock;
            if (adjustmentType === "set") {
                newStock = qty;
            } else if (adjustmentType === "add") {
                newStock = product.stock + qty;
            } else if (adjustmentType === "subtract") {
                newStock = Math.max(0, product.stock - qty);
            }

            const result = await updateProduct(product.id, { stock: newStock });
            if (result.success) {
                toast.success(`Stock updated to ${newStock} units`);
                onOpenChange(false);
                onSuccess?.();
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update stock");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const calculateNewStock = () => {
        if (!product || !quantity) return product?.stock || 0;
        const qty = parseInt(quantity);
        if (isNaN(qty)) return product.stock;

        if (adjustmentType === "set") {
            return qty;
        } else if (adjustmentType === "add") {
            return product.stock + qty;
        } else {
            return Math.max(0, product.stock - qty);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
                    <DialogDescription>
                        Current stock: <strong>{product.stock} units</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Adjustment Type</Label>
                        <Select value={adjustmentType} onValueChange={(value: "set" | "add" | "subtract") => setAdjustmentType(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="set">Set to specific quantity</SelectItem>
                                <SelectItem value="add">Add to current stock</SelectItem>
                                <SelectItem value="subtract">Subtract from current stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            {adjustmentType === "set" ? "New Quantity" : adjustmentType === "add" ? "Quantity to Add" : "Quantity to Subtract"}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0"
                            required
                        />
                    </div>

                    {adjustmentType !== "set" && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>New stock will be:</strong> {calculateNewStock()} units
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Restocked from supplier, Damaged items, etc."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Stock"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

