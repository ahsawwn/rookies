"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminCard } from "./Card";
import { AdminButton } from "./Button";
import { ReceiptPrinter } from "./ReceiptPrinter";
import { FiX, FiMinus, FiPlus, FiPercent, FiSearch, FiPrinter } from "react-icons/fi";
import Image from "next/image";
import { toast } from "sonner";

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
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [notes, setNotes] = useState("");

    // Debug: Log products on mount
    useEffect(() => {
        console.log("[POSPageClient] Initial products:", initialProducts?.length || 0);
        if (initialProducts?.length === 0) {
            console.warn("[POSPageClient] No products received!");
        }
    }, [initialProducts]);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        initialProducts.forEach((product) => {
            const category = product.category || "uncategorized";
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(product);
        });
        return grouped;
    }, [initialProducts]);

    const categories = useMemo(() => {
        return Object.keys(productsByCategory).sort();
    }, [productsByCategory]);

    // Filter products based on category and search
    const filteredProducts = useMemo(() => {
        let products = initialProducts;
        
        if (selectedCategory !== "all") {
            products = products.filter((p) => (p.category || "uncategorized") === selectedCategory);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    (p.category || "").toLowerCase().includes(query) ||
                    (p.description || "").toLowerCase().includes(query)
            );
        }
        
        return products;
    }, [initialProducts, selectedCategory, searchQuery]);

    const formatCurrency = (amount: string | number) => {
        return `Rs. ${parseFloat(amount.toString()).toFixed(2)}`;
    };

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

    const [saleNumber, setSaleNumber] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    const processPayment = async () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POSPageClient.tsx:115',message:'processPayment called',data:{cartLength:cart.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setIsProcessing(true);
        try {
            // Generate sale number
            const newSaleNumber = `SALE-${Date.now()}`;
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POSPageClient.tsx:127',message:'Setting saleNumber',data:{newSaleNumber},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
            // #endregion
            
            setSaleNumber(newSaleNumber);

            // TODO: Save sale to database
            // For now, just show success
            toast.success(`Payment processed! Sale #${newSaleNumber}. Receipt downloading...`);
            
            // Clear cart after a delay to allow receipt PDF generation and download
            // Increased delay to ensure PDF generation completes
            setTimeout(() => {
                setCart([]);
                setDiscount(0);
                setCustomerName("");
                setCustomerPhone("");
                setCustomerEmail("");
                setNotes("");
                // Keep saleNumber for a bit longer so receipt can be regenerated if needed
                setTimeout(() => {
                    setSaleNumber("");
                }, 3000);
            }, 5000);
        } catch (error) {
            console.error("Payment processing error:", error);
            toast.error("Failed to process payment");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Point of Sale</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Process sales and manage transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Products Grid */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search and Category Filter */}
                    <AdminCard>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`px-3 md:px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm md:text-base ${
                                        selectedCategory === "all"
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                    className={`px-3 md:px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm md:text-base ${
                                        selectedCategory === category
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)} ({productsByCategory[category]?.length || 0})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AdminCard>

                    {/* Products Grid */}
                    <AdminCard header={<h2 className="text-base md:text-lg font-semibold">Products ({filteredProducts.length})</h2>}>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-1 md:p-2 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md cursor-pointer transition-all bg-white group"
                                    >
                                        <div className="relative aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <p className="font-medium text-xs line-clamp-2 mb-1 text-gray-900">{product.name}</p>
                                        <p className="text-purple-600 font-bold text-xs md:text-sm">{formatCurrency(product.price)}</p>
                                        {product.stock !== undefined && product.stock < 10 && (
                                            <p className="text-xs text-amber-600 mt-0.5">Stock: {product.stock}</p>
                                        )}
                                    </div>
                                ))
                            ) : initialProducts.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 mb-2 font-medium">No products found in database</p>
                                    <p className="text-sm text-gray-400">Please add products from the Products page first</p>
                                </div>
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-12">
                                    No products match your filters. Try changing category or search.
                                </p>
                            )}
                        </div>
                    </AdminCard>
                </div>

                {/* Cart */}
                <div className="space-y-4 md:space-y-6">
                    <AdminCard
                        header={
                            <div className="flex items-center justify-between">
                                <h2 className="text-base md:text-lg font-semibold">Cart</h2>
                                <span className="text-xs md:text-sm text-gray-600">{cart.length} items</span>
                            </div>
                        }
                    >
                        <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.product.name}</p>
                                            <p className="text-xs text-gray-600">
                                                {formatCurrency(item.product.price)} each
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
                                                {formatCurrency(parseFloat(item.product.price) * item.quantity)}
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
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiPercent className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Discount %"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span>Tax (10%)</span>
                                    <span>{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-base md:text-lg pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-purple-600">{formatCurrency(total)}</span>
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
                                    <div className="space-y-2">
                                        <AdminButton
                                            variant="primary"
                                            onClick={processPayment}
                                            disabled={isProcessing || cart.length === 0}
                                            className="w-full"
                                        >
                                            {isProcessing ? "Processing..." : "Process Payment"}
                                        </AdminButton>
                                        {saleNumber && (
                                            <ReceiptPrinter
                                                items={cart}
                                                subtotal={subtotal}
                                                discount={discount}
                                                discountAmount={discountAmount}
                                                tax={tax}
                                                total={total}
                                                paymentMethod={paymentMethod}
                                                saleNumber={saleNumber}
                                                autoDownload={true}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
