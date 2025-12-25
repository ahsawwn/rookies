"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";
import { searchProducts } from "@/server/products";
import Link from "next/link";
import Image from "next/image";

// Custom debounce hook
function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    return debouncedCallback;
}

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: string;
    image: string;
    shortDescription?: string | null;
}

interface SearchDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const result = await searchProducts(searchQuery);
            if (result.success) {
                setResults(result.products.slice(0, 8) as SearchResult[]);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedSearch = useDebounce(performSearch, 300);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < results.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            const selectedProduct = results[selectedIndex];
            if (selectedProduct) {
                router.push(`/shop/${selectedProduct.slug}`);
                onClose();
            }
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    const handleProductClick = (slug: string) => {
        router.push(`/shop/${slug}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div
                ref={dropdownRef}
                className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 p-4">
                    <FiSearch className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for cookies, flavors..."
                        className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                    />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery("");
                                setResults([]);
                                inputRef.current?.focus();
                            }}
                            className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                            <p className="mt-2">Searching...</p>
                        </div>
                    ) : query.trim() && results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No products found</p>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="divide-y divide-gray-100">
                                {results.map((product, index) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product.slug)}
                                        className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                                            index === selectedIndex ? "bg-gray-50" : ""
                                        }`}
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold text-gray-900">
                                                {product.name}
                                            </h3>
                                            {product.shortDescription && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                                    {product.shortDescription}
                                                </p>
                                            )}
                                            <p className="text-pink-600 font-bold mt-1">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </p>
                                        </div>
                                        <FiArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                            {query.trim() && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={onClose}
                                    className="block w-full p-4 text-center text-pink-600 font-semibold hover:bg-pink-50 transition-colors border-t border-gray-100"
                                >
                                    See all results for "{query}"
                                    <FiArrowRight className="inline-block ml-2 w-4 h-4" />
                                </Link>
                            )}
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p>Start typing to search...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

