"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        shortDescription?: string | null;
        price: string;
        originalPrice?: string | null;
        image: string;
        category: string;
        calories?: number | null;
        isFeatured?: boolean;
    };
    onFavoriteToggle?: (productId: string) => void;
    isFavorite?: boolean;
}

export function ProductCard({ product, onFavoriteToggle, isFavorite = false }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { addItem } = useCart();

    const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
    const discountPercent = hasDiscount
        ? Math.round(
              ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
                  parseFloat(product.originalPrice!)) *
                  100
          )
        : 0;

    // Format price in Pakistani Rupees
    const formattedPrice = `Rs. ${parseFloat(product.price).toFixed(2)}`;

    const formattedOriginalPrice = product.originalPrice
        ? `Rs. ${parseFloat(product.originalPrice).toFixed(2)}`
        : null;

    const categoryColors: Record<string, string> = {
        classic: "bg-blue-100 text-blue-700 border-blue-200",
        featured: "bg-pink-100 text-pink-700 border-pink-200",
        seasonal: "bg-orange-100 text-orange-700 border-orange-200",
    };

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#E91E63] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Larger with minimum 400px */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] min-h-[400px]">
                {!imageError ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-700 ease-out",
                            isHovered && "scale-105"
                        )}
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
                        <span className="text-6xl">🍪</span>
                    </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-red-500 text-white border-0 font-bold">
                            -{discountPercent}%
                        </Badge>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge
                        className={cn(
                            "backdrop-blur-sm bg-white/90 border",
                            categoryColors[product.category] || "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                    >
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Badge>
                </div>

                {/* Favorite Button */}
                {onFavoriteToggle && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onFavoriteToggle(product.id);
                        }}
                        className="absolute bottom-3 right-3 z-10 w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
                    >
                        <FiHeart
                            className={cn(
                                "w-5 h-5 transition-colors",
                                isFavorite ? "text-red-500 fill-current" : "text-gray-400"
                            )}
                        />
                    </button>
                )}

                {/* Hover Overlay with Quick Add Button */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <button 
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                                await addItem(product.id, 1, {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    slug: product.slug,
                                });
                                toast.success(`${product.name} added to cart!`, {
                                    style: {
                                        background: '#E91E63',
                                        color: 'white',
                                    },
                                });
                            } catch (error) {
                                toast.error("Failed to add item to cart");
                            }
                        }}
                        className="px-6 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-bold rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>Quick Add</span>
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
                <div className="mb-3">
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 hover:text-[#E91E63] transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    {product.shortDescription && (
                        <p className="text-sm text-[#6B6B6B] line-clamp-2 leading-relaxed">{product.shortDescription}</p>
                    )}
                </div>

                {/* Price, Calories, and Badge */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {formattedOriginalPrice}
                            </span>
                        )}
                        <span className="text-2xl font-bold text-[#E91E63]">{formattedPrice}</span>
                    </div>
                    {product.calories && (
                        <Badge className="bg-[#F5E6D3] text-[#1a1a1a] border-0 font-medium">
                            {product.calories} cal
                        </Badge>
                    )}
                </div>

                {/* View Details Button */}
                <Link
                    href={`/shop/${product.slug}`}
                    className="mt-4 w-full bg-gradient-to-r from-[#FFF8F0] to-[#F5E6D3] hover:from-[#E91E63] hover:to-[#C2185B] text-[#1a1a1a] hover:text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                </Link>
            </div>
        </div>
    );
}

