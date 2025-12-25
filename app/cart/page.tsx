"use client";

import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";
import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProductBySlug } from "@/server/products";
import { toast } from "sonner";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                // Check if any items are missing product details
                const itemsNeedingDetails = items.filter((item) => !item.product);
                
                if (itemsNeedingDetails.length > 0) {
                    // Fetch missing product details
                    // For now, we'll just use what we have
                    // In a real app, you'd fetch by productId
                }

                // Use products from cart items
                const loadedProducts = items
                    .map((item) => item.product)
                    .filter((p) => p !== undefined && p !== null);
                setProducts(loadedProducts);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (items.length > 0) {
            loadProducts();
        } else {
            setIsLoading(false);
        }
    }, [items]);

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeItem(productId);
        } else {
            await updateQuantity(productId, newQuantity);
        }
    };

    const handleRemove = async (productId: string) => {
        await removeItem(productId);
        toast.success("Item removed from cart");
    };

    const subtotal = getTotal();
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping on orders Rs. 2000+
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B9D] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading cart...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding some delicious cookies to your cart!</p>
                        <Link href="/shop">
                            <Button className="bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const product = item.product || products.find((p) => p.id === item.productId);
                            if (!product) return null;

                            return (
                                <div
                                    key={item.productId}
                                    className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    {/* Product Image */}
                                    <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
                                        <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <Link href={`/shop/${product.slug}`}>
                                                <h3 className="font-semibold text-black hover:text-[#FF6B9D] transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-[#FF6B9D] font-bold mt-1">
                                                Rs. {parseFloat(product.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors"
                                                >
                                                    <FiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors"
                                                >
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    Rs. {(parseFloat(product.price) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.productId)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>Rs. {tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            {subtotal < 2000 && (
                                <p className="text-sm text-amber-600 mb-4">
                                    Add Rs. {(2000 - subtotal).toFixed(2)} more for free shipping!
                                </p>
                            )}

                            <Link 
                                href="/order-type" 
                                className="block"
                            >
                                <Button className="w-full bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white py-6 text-lg font-bold">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            <Link href="/shop" className="block mt-4 text-center text-gray-600 hover:text-[#FF6B9D] transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

