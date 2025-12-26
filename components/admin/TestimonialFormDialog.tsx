"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createTestimonial } from "@/server/testimonials";

interface TestimonialFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingTestimonial?: any;
}

export function TestimonialFormDialog({
    isOpen,
    onClose,
    onSuccess,
    editingTestimonial,
}: TestimonialFormDialogProps) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("5");
    const [avatar, setAvatar] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingTestimonial) {
            setName(editingTestimonial.name || "");
            setRole(editingTestimonial.role || "");
            setComment(editingTestimonial.comment || "");
            setRating(String(editingTestimonial.rating || 5));
            setAvatar(editingTestimonial.avatar || "");
        } else {
            resetForm();
        }
    }, [editingTestimonial, isOpen]);

    const resetForm = () => {
        setName("");
        setRole("");
        setComment("");
        setRating("5");
        setAvatar("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !comment) {
            toast.error("Please fill in name and comment");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createTestimonial({
                name,
                role: role || undefined,
                comment,
                rating: parseInt(rating),
                avatar: avatar || undefined,
            });

            if (result.success) {
                toast.success("Testimonial created successfully");
                resetForm();
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || "Failed to create testimonial");
            }
        } catch (error) {
            console.error("Error creating testimonial:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingTestimonial
                            ? "Update testimonial details"
                            : "Add a new customer testimonial (requires admin approval)"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g., Cookie Enthusiast"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment *</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            placeholder="What did the customer say?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating *</Label>
                            <Select value={rating} onValueChange={setRating} required>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <SelectItem key={r} value={String(r)}>
                                            {r} {r === 1 ? "Star" : "Stars"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar Initials</Label>
                            <Input
                                id="avatar"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="e.g., SJ"
                                maxLength={2}
                            />
                        </div>
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
                            {isSubmitting ? "Saving..." : editingTestimonial ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

