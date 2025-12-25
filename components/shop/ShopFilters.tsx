"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiFilter, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
    onFiltersChange: (filters: {
        category?: string;
        search?: string;
        sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
    }) => void;
    activeCategory?: string;
    activeSearch?: string;
    activeSort?: string;
}

const categories = [
    { id: "all", name: "All Products" },
    { id: "cookies", name: "Cookies" },
    { id: "shakes", name: "Shakes" },
    { id: "cupcakes", name: "Cupcakes" },
    { id: "cakes", name: "Cakes" },
    { id: "croissants", name: "Croissants" },
    { id: "breads", name: "Breads" },
];

const sortOptions = [
    { id: "newest", name: "Newest First" },
    { id: "name-asc", name: "Name (A-Z)" },
    { id: "name-desc", name: "Name (Z-A)" },
    { id: "price-asc", name: "Price: Low to High" },
    { id: "price-desc", name: "Price: High to Low" },
];

export function ShopFilters({
    onFiltersChange,
    activeCategory = "all",
    activeSearch = "",
    activeSort = "newest",
}: ShopFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(activeSearch);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onFiltersChange({
                category: activeCategory,
                search: searchQuery || undefined,
                sortBy: activeSort as any,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCategoryChange = (category: string) => {
        onFiltersChange({
            category: category === "all" ? undefined : category,
            search: searchQuery || undefined,
            sortBy: activeSort as any,
        });
    };

    const handleSortChange = (sort: string) => {
        setIsSortOpen(false);
        onFiltersChange({
            category: activeCategory === "all" ? undefined : activeCategory,
            search: searchQuery || undefined,
            sortBy: sort as any,
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        onFiltersChange({
            category: undefined,
            search: undefined,
            sortBy: "newest",
        });
    };

    const hasActiveFilters =
        activeCategory !== "all" || searchQuery.length > 0 || activeSort !== "newest";

    return (
        <div className="space-y-4">
            {/* Desktop Filters */}
            <div className="hidden md:block space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#E91E63] focus:ring-[#E91E63]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={cn(
                                "px-4 py-2 rounded-full font-medium text-sm transition-all duration-300",
                                activeCategory === category.id
                                    ? "bg-[#E91E63] hover:bg-[#C2185B] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Sort and Clear */}
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-700">Sort:</span>
                            <span className="text-sm text-gray-900">
                                {sortOptions.find((opt) => opt.id === activeSort)?.name || "Newest First"}
                            </span>
                            <FiChevronDown
                                className={cn(
                                    "w-4 h-4 text-gray-600 transition-transform",
                                    isSortOpen && "rotate-180"
                                )}
                            />
                        </button>

                        {isSortOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsSortOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSortChange(option.id)}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                                                activeSort === option.id && "bg-pink-50 text-[#E91E63] font-semibold"
                                            )}
                                        >
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden space-y-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-9 h-10 rounded-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <FiFilter className="w-4 h-4" />
                    </button>
                </div>

                {isMobileFiltersOpen && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        handleCategoryChange(category.id);
                                        setIsMobileFiltersOpen(false);
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium",
                                        activeCategory === category.id
                                            ? "bg-[#E91E63] text-white"
                                            : "bg-gray-100 text-gray-700"
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                            <select
                                value={activeSort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

