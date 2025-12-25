"use client";

import { useState } from "react";
import { FiHeart, FiShoppingCart, FiShare2, FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductActionsProps {
    product: {
        id: string;
        name: string;
        price: string;
        originalPrice?: string | null;
        stock: number;
    };
    onAddToCart?: (quantity: number) => void;
    onFavoriteToggle?: () => void;
    isFavorite?: boolean;
}

export function ProductActions({
    product,
    onAddToCart,
    onFavoriteToggle,
    isFavorite = false,
}: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);

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

    const isOutOfStock = product.stock <= 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(1, Math.min(product.stock || 99, quantity + delta));
        setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        if (!isOutOfStock && onAddToCart) {
            onAddToCart(quantity);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on Rookies!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing:", err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="space-y-6">
            {/* Price */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    {hasDiscount && (
                        <Badge className="bg-red-500 text-white border-0 font-bold">
                            -{discountPercent}%
                        </Badge>
                    )}
                    <span className="text-4xl font-bold text-gray-900">{formattedPrice}</span>
                </div>
                {hasDiscount && (
                    <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-400 line-through">
                            {formattedOriginalPrice}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                            Save {formattedOriginalPrice && (
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(parseFloat(product.originalPrice!) - parseFloat(product.price))
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Stock Status */}
            {isOutOfStock ? (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">Out of Stock</p>
                </div>
            ) : (
                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                        {product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`}
                    </p>
                </div>
            )}

            {/* Quantity Selector */}
            {!isOutOfStock && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="px-6 py-3 font-semibold text-gray-900 min-w-[60px] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= (product.stock || 99)}
                                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiShoppingCart className="w-5 h-5 mr-2" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <div className="flex gap-3">
                    {onFavoriteToggle && (
                        <Button
                            onClick={onFavoriteToggle}
                            variant="outline"
                            className={cn(
                                "flex-1 border-2",
                                isFavorite
                                    ? "border-red-500 text-red-600 bg-red-50"
                                    : "border-gray-200 hover:border-pink-300"
                            )}
                        >
                            <FiHeart
                                className={cn(
                                    "w-5 h-5 mr-2",
                                    isFavorite && "fill-current"
                                )}
                            />
                            {isFavorite ? "Saved" : "Save"}
                        </Button>
                    )}

                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="flex-1 border-2 border-gray-200 hover:border-pink-300"
                    >
                        <FiShare2 className="w-5 h-5 mr-2" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
}

