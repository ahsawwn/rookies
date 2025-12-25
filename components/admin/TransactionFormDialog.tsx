"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { createTransaction } from "@/server/accounting";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FiCalendar } from "react-icons/fi";

interface TransactionFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const incomeCategories = [
    "Sales",
    "Other Income",
    "Refunds",
    "Interest",
];

const expenseCategories = [
    "Cost of Goods",
    "Supplies",
    "Rent",
    "Utilities",
    "Salaries",
    "Marketing",
    "Other Expenses",
];

export function TransactionFormDialog({ open, onOpenChange, onSuccess }: TransactionFormDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<"income" | "expense">("income");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setType("income");
            setCategory("");
            setDescription("");
            setAmount("");
            setDate(new Date());
        }
    }, [open]);

    const categories = type === "income" ? incomeCategories : expenseCategories;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const result = await createTransaction({
                type,
                category,
                description: description || undefined,
                amount,
                date: date ? date.toISOString() : undefined,
            });

            if (result.success) {
                toast.success("Transaction created successfully");
                onOpenChange(false);
                onSuccess?.();
                router.refresh();
            } else {
                toast.error(result.error || "Failed to create transaction");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new income or expense transaction
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Transaction Type *</Label>
                        <Select value={type} onValueChange={(value: "income" | "expense") => {
                            setType(value);
                            setCategory("");
                        }}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (Rs.) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Transaction description"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <FiCalendar className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setDatePickerOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Transaction"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

