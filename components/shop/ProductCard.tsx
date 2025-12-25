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

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(product.price));

    const formattedOriginalPrice = product.originalPrice
        ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
          }).format(parseFloat(product.originalPrice))
        : null;

    const categoryColors: Record<string, string> = {
        classic: "bg-blue-100 text-blue-700 border-blue-200",
        featured: "bg-pink-100 text-pink-700 border-pink-200",
        seasonal: "bg-orange-100 text-orange-700 border-orange-200",
    };

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF6B9D] transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {!imageError ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500",
                            isHovered && "scale-110"
                        )}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
                        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                        <FiHeart
                            className={cn(
                                "w-5 h-5 transition-colors",
                                isFavorite ? "text-red-500 fill-current" : "text-gray-400"
                            )}
                        />
                    </button>
                )}

                {/* Hover Overlay with Actions */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Link
                        href={`/shop/${product.slug}`}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors shadow-lg"
                    >
                        <FiEye className="w-5 h-5 text-gray-700" />
                    </Link>
                    <button 
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                await addItem(product.id, 1, {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    slug: product.slug,
                                });
                                toast.success(`${product.name} added to cart!`);
                            } catch (error) {
                                toast.error("Failed to add item to cart");
                            }
                        }}
                        className="w-12 h-12 bg-[#FF6B9D] rounded-full flex items-center justify-center hover:bg-[#FF4A7A] transition-colors shadow-lg"
                    >
                        <FiShoppingCart className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <div className="mb-2">
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="text-lg font-bold text-black mb-1 hover:text-[#FF6B9D] transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    {product.shortDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
                    )}
                </div>

                {/* Price and Calories */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {formattedOriginalPrice}
                            </span>
                        )}
                        <span className="text-xl font-bold text-[#FF6B9D]">{formattedPrice}</span>
                    </div>
                    {product.calories && (
                        <span className="text-xs text-gray-500">{product.calories} cal</span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Link
                    href={`/shop/${product.slug}`}
                    className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-all duration-300"
                >
                    <FiShoppingCart className="w-4 h-4" />
                    <span>View Details</span>
                </Link>
            </div>
        </div>
    );
}

