"use client";

import { useState } from "react";
import { AdminCard } from "./Card";
import { AdminButton } from "./Button";
import { FiX, FiMinus, FiPlus, FiPercent } from "react-icons/fi";
import Image from "next/image";

interface CartItem {
    product: any;
    quantity: number;
}

interface POSPageClientProps {
    initialProducts: any[];
}

export function POSPageClient({ initialProducts }: POSPageClientProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const tax = (subtotal - discountAmount) * 0.1; // 10% tax
    const total = subtotal - discountAmount + tax;

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const processPayment = () => {
        // Handle payment processing
        alert("Payment processed!");
        setCart([]);
        setDiscount(0);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
                <p className="text-gray-600 mt-1">Process sales and manage transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products Grid */}
                <div className="lg:col-span-2">
                    <AdminCard header={<h2 className="text-lg font-semibold">Products</h2>}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                            {initialProducts.length > 0 ? (
                                initialProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:shadow-md cursor-pointer transition-all"
                                    >
                                        <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-pink-600 font-bold">${parseFloat(product.price).toFixed(2)}</p>
                                        {product.stock < 10 && (
                                            <p className="text-xs text-amber-600">Low stock: {product.stock}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-12">
                                    No products available
                                </p>
                            )}
                        </div>
                    </AdminCard>
                </div>

                {/* Cart */}
                <div className="space-y-6">
                    <AdminCard
                        header={
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Cart</h2>
                                <span className="text-sm text-gray-600">{cart.length} items</span>
                            </div>
                        }
                    >
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.product.name}</p>
                                            <p className="text-xs text-gray-600">
                                                ${parseFloat(item.product.price).toFixed(2)} each
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <FiMinus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-red-600 hover:text-red-700 mt-1"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">Cart is empty</p>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiPercent className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                                        placeholder="Discount %"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span>Tax (10%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="digital">Digital Wallet</option>
                                    </select>
                                    <AdminButton
                                        variant="primary"
                                        onClick={processPayment}
                                        className="w-full"
                                    >
                                        Process Payment
                                    </AdminButton>
                                </div>
                            </div>
                        )}
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
