"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DataTable";
import { TestimonialFormDialog } from "./TestimonialFormDialog";
import { FiMessageSquare, FiPlus, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { deleteTestimonial, updateTestimonial } from "@/server/testimonials";
import { getCurrentAdmin } from "@/server/admin";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
    id: string;
    name: string;
    role?: string | null;
    comment: string;
    rating: number;
    avatar?: string | null;
    isApproved: boolean;
    isFeatured: boolean;
}

interface TestimonialsPageClientProps {
    initialTestimonials: Testimonial[];
}

export default function TestimonialsPageClient({
    initialTestimonials,
}: TestimonialsPageClientProps) {
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) {
            return;
        }

        const result = await deleteTestimonial(id);
        if (result.success) {
            setTestimonials(testimonials.filter((t) => t.id !== id));
            toast.success("Testimonial deleted");
        } else {
            toast.error(result.error || "Failed to delete testimonial");
        }
    };

    const handleApprove = async (id: string) => {
        const adminResult = await getCurrentAdmin();
        if (!adminResult.success || !adminResult.admin) {
            toast.error("Admin session expired");
            return;
        }

        const result = await updateTestimonial(id, {
            isApproved: true,
            adminId: adminResult.admin.id,
        });

        if (result.success) {
            setTestimonials(
                testimonials.map((t) => (t.id === id ? { ...t, isApproved: true } : t))
            );
            toast.success("Testimonial approved");
        } else {
            toast.error(result.error || "Failed to approve testimonial");
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
        const adminResult = await getCurrentAdmin();
        if (!adminResult.success || !adminResult.admin) {
            toast.error("Admin session expired");
            return;
        }

        const result = await updateTestimonial(id, {
            isFeatured: !currentFeatured,
            adminId: adminResult.admin.id,
        });

        if (result.success) {
            setTestimonials(
                testimonials.map((t) =>
                    t.id === id ? { ...t, isFeatured: !currentFeatured } : t
                )
            );
            toast.success(`Testimonial ${!currentFeatured ? "featured" : "unfeatured"}`);
        } else {
            toast.error(result.error || "Failed to update testimonial");
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingTestimonial(null);
    };

    const handleFormSuccess = () => {
        window.location.reload();
    };

    const columns = [
        {
            key: "name",
            header: "Name",
            render: (row: Testimonial) => row.name,
        },
        {
            key: "role",
            header: "Role",
            render: (row: Testimonial) => row.role || "—",
        },
        {
            key: "comment",
            header: "Comment",
            render: (row: Testimonial) => (
                <span className="line-clamp-2 max-w-md">{row.comment}</span>
            ),
        },
        {
            key: "rating",
            header: "Rating",
            render: (row: Testimonial) => "★".repeat(row.rating || 5),
        },
        {
            key: "status",
            header: "Status",
            render: (row: Testimonial) => (
                <div className="flex gap-2">
                    {row.isApproved ? (
                        <Badge className="bg-green-100 text-green-700">Approved</Badge>
                    ) : (
                        <Badge variant="outline">Pending</Badge>
                    )}
                    {row.isFeatured && (
                        <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
                    )}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (row: Testimonial) => (
                <div className="flex gap-2">
                    {!row.isApproved && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(row.id)}
                        >
                            <FiCheck className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(row.id, row.isFeatured)}
                    >
                        {row.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
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
                    <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
                    <p className="text-gray-600 mt-1">Manage customer testimonials and reviews</p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Testimonial
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Testimonials</CardTitle>
                    <CardDescription>
                        Approve and feature testimonials to display on the home page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {testimonials.length > 0 ? (
                        <DataTable data={testimonials} columns={columns} />
                    ) : (
                        <div className="text-center py-12">
                            <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No testimonials yet</p>
                            <Button
                                onClick={() => setIsFormOpen(true)}
                                variant="outline"
                            >
                                <FiPlus className="w-4 h-4 mr-2" />
                                Add Your First Testimonial
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <TestimonialFormDialog
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                editingTestimonial={editingTestimonial}
            />
        </div>
    );
}

