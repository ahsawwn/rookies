"use client";

import { ProductActions } from "./ProductActions";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductActionsWithDetailsProps {
    product: {
        id: string;
        name: string;
        price: string;
        originalPrice?: string | null;
        stock: number;
        image: string;
        slug: string;
    };
    onFavoriteToggle?: () => void;
    isFavorite?: boolean;
}

export function ProductActionsWithDetails({
    product,
    onFavoriteToggle,
    isFavorite = false,
}: ProductActionsWithDetailsProps) {
    const { addItem } = useCart();

    const handleAddToCart = async (quantity: number) => {
        try {
            await addItem(product.id, quantity, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
            });
            toast.success(`${quantity} ${product.name} added to cart!`);
        } catch (error) {
            toast.error("Failed to add item to cart");
        }
    };

    return (
        <ProductActions
            product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                stock: product.stock,
            }}
            onAddToCart={handleAddToCart}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
        />
    );
}

