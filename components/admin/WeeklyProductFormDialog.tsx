"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createWeeklyProduct } from "@/server/weekly-products";
import { getCurrentAdmin } from "@/server/admin";

interface WeeklyProductFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    products: any[];
    editingProduct?: any;
}

export function WeeklyProductFormDialog({
    isOpen,
    onClose,
    onSuccess,
    products,
    editingProduct,
}: WeeklyProductFormDialogProps) {
    const [productId, setProductId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setProductId(editingProduct.productId);
            setStartDate(formatDateForInput(editingProduct.startDate));
            setEndDate(formatDateForInput(editingProduct.endDate));
        } else {
            resetForm();
        }
    }, [editingProduct, isOpen]);

    const formatDateForInput = (date: Date | string) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const resetForm = () => {
        setProductId("");
        setStartDate("");
        setEndDate("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId || !startDate || !endDate) {
            toast.error("Please fill in all fields");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            toast.error("End date must be after start date");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current admin
            const adminResult = await getCurrentAdmin();
            if (!adminResult.success || !adminResult.admin) {
                toast.error("Admin session expired. Please log in again.");
                return;
            }

            const result = await createWeeklyProduct({
                productId,
                startDate: start,
                endDate: end,
                adminId: adminResult.admin.id,
            });

            if (result.success) {
                toast.success("Weekly product scheduled successfully");
                resetForm();
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || "Failed to create weekly product");
            }
        } catch (error) {
            console.error("Error creating weekly product:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingProduct ? "Edit Weekly Product" : "Add Weekly Product"}
                    </DialogTitle>
                    <DialogDescription>
                        Schedule a product to appear on the home page for a specific week
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product">Product *</Label>
                        <Select value={productId} onValueChange={setProductId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                            {isSubmitting ? "Saving..." : editingProduct ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

