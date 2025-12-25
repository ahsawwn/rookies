"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();
    const router = useRouter();
    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            await handleRemove(productId);
        } else {
            await updateQuantity(productId, newQuantity);
        }
    };

    const handleRemove = async (productId: string) => {
        setIsRemoving(productId);
        // Small delay for animation
        setTimeout(async () => {
            await removeItem(productId);
            setIsRemoving(null);
            toast.success("Item removed from cart");
        }, 200);
    };

    const handleCheckout = () => {
        onClose();
        router.push("/checkout");
    };

    const handleViewCart = () => {
        onClose();
        router.push("/cart");
    };

    const subtotal = getTotal();
    const shipping = subtotal > 2000 ? 0 : 200;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    const itemCount = getItemCount();

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Shopping Cart" side="right" size="md">
            <div className="flex flex-col h-full">
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FiShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-600 mb-6">Start adding some delicious cookies to your cart!</p>
                            <Button
                                onClick={onClose}
                                className="bg-[#E91E63] hover:bg-[#C2185B] text-white"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const product = item.product;
                                if (!product) return null;

                                return (
                                    <div
                                        key={item.productId}
                                        className={cn(
                                            "flex gap-4 p-4 bg-white border border-gray-200 rounded-lg transition-all duration-300",
                                            isRemoving === item.productId && "opacity-0 scale-95"
                                        )}
                                    >
                                        {/* Product Image */}
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            onClick={onClose}
                                            className="flex-shrink-0"
                                        >
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/shop/${product.slug}`}
                                                onClick={onClose}
                                                className="block"
                                            >
                                                <h3 className="font-semibold text-gray-900 hover:text-[#E91E63] transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-[#E91E63] font-bold mt-1">
                                                Rs. {parseFloat(product.price).toFixed(2)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-gray-50 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 font-semibold min-w-[40px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-gray-50 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item.productId)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                                    aria-label="Remove item"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with Summary and Checkout */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>Rs. {tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>Rs. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {subtotal < 2000 && (
                            <p className="text-sm text-amber-600">
                                Add Rs. {(2000 - subtotal).toFixed(2)} more for free shipping!
                            </p>
                        )}

                        <div className="space-y-2">
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white py-6 text-lg font-bold"
                            >
                                Proceed to Checkout
                            </Button>
                            <Button
                                onClick={handleViewCart}
                                variant="outline"
                                className="w-full"
                            >
                                View Full Cart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
}

