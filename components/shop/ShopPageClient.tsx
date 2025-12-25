"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";

interface ShopPageClientProps {
    initialProducts: any[];
    initialCategory: string;
    initialSearch: string;
    initialSort: string;
}

export function ShopPageClient({
    initialProducts,
    initialCategory,
    initialSearch,
    initialSort,
}: ShopPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFiltersChange = (filters: {
        category?: string;
        search?: string;
        sortBy?: string;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.category) {
            params.set("category", filters.category);
        } else {
            params.delete("category");
        }

        if (filters.search) {
            params.set("search", filters.search);
        } else {
            params.delete("search");
        }

        if (filters.sortBy && filters.sortBy !== "newest") {
            params.set("sortBy", filters.sortBy);
        } else {
            params.delete("sortBy");
        }

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <>
            {/* Filters */}
            <div className="mb-8">
                <ShopFilters
                    onFiltersChange={handleFiltersChange}
                    activeCategory={initialCategory}
                    activeSearch={initialSearch}
                    activeSort={initialSort}
                />
            </div>

            {/* Products Grid */}
            {initialProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {initialProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <span className="text-4xl">🍪</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                        {initialSearch
                            ? "Try adjusting your search or filters"
                            : "Check back soon for new products!"}
                    </p>
                </div>
            )}
        </>
    );
}

