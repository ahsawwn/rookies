"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShopFilters } from "@/components/shop/ShopFilters";

interface SearchFiltersWrapperProps {
    initialCategory: string;
    initialSortBy: string;
    initialSearch: string;
}

export function SearchFiltersWrapper({
    initialCategory,
    initialSortBy,
    initialSearch,
}: SearchFiltersWrapperProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFiltersChange = (filters: {
        category?: string;
        search?: string;
        sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
    }) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (filters.category && filters.category !== "all") {
            params.set("category", filters.category);
        } else {
            params.delete("category");
        }
        
        if (filters.search) {
            params.set("q", filters.search);
        } else {
            params.delete("q");
        }
        
        if (filters.sortBy && filters.sortBy !== "newest") {
            params.set("sortBy", filters.sortBy);
        } else {
            params.delete("sortBy");
        }
        
        router.push(`/search?${params.toString()}`);
    };

    return (
        <ShopFilters
            onFiltersChange={handleFiltersChange}
            activeCategory={initialCategory}
            activeSearch={initialSearch}
            activeSort={initialSortBy}
        />
    );
}

