"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/contexts/SessionContext";
import { createOrder } from "@/server/orders";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiCreditCard, FiTruck, FiMapPin, FiCheck } from "react-icons/fi";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const { session, isLoading: sessionLoading } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"delivery" | "payment" | "review">("delivery");

    // Get delivery type from URL params or localStorage
    const getDeliveryType = (): "delivery" | "pickup" => {
        const urlType = searchParams.get("type") as "delivery" | "pickup" | null;
        if (urlType === "delivery" || urlType === "pickup") {
            return urlType;
        }
        if (typeof window !== "undefined") {
            const storedType = localStorage.getItem("selectedDeliveryType") as "delivery" | "pickup" | null;
            if (storedType === "delivery" || storedType === "pickup") {
                return storedType;
            }
        }
        return "delivery"; // Default
    };

    // Delivery form state
    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(getDeliveryType());
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
    });
    
    // Pickup form state
    const [pickupInfo, setPickupInfo] = useState({
        name: "",
        phone: "",
    });

    // Payment form state
    const [paymentMethod, setPaymentMethod] = useState("cash");

    // Guest contact info (required for all orders)
    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Guest checkout - no login required
    // Just ensure cart has items

    useEffect(() => {
        // Wait for session to finish loading before checking cart
        if (sessionLoading) return;
        
        if (items.length === 0) {
            router.push("/cart");
            return;
        }

        // Check if delivery type is selected, if not redirect to order-type page
        const type = getDeliveryType();
        if (!type || (type !== "delivery" && type !== "pickup")) {
            router.push("/order-type");
            return;
        }
        setDeliveryType(type);
    }, [items, sessionLoading, router, searchParams]);

    const subtotal = getTotal();
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping on orders Rs. 2000+
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    // Get or create guest session ID
    const getGuestSessionId = () => {
        if (typeof window === "undefined") return undefined;
        let sessionId = localStorage.getItem("guestSessionId");
        if (!sessionId) {
            sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("guestSessionId", sessionId);
        }
        return sessionId;
    };

    const handlePlaceOrder = async () => {
        // Validate guest contact info (required for all orders)
        if (!guestInfo.name.trim() || !guestInfo.email.trim() || !guestInfo.phone.trim()) {
            toast.error("Please provide your name, email, and phone number");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestInfo.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validate delivery address if delivery type
        if (deliveryType === "delivery") {
            if (!deliveryAddress.street.trim() || !deliveryAddress.city.trim() || !deliveryAddress.state.trim() || !deliveryAddress.zipCode.trim()) {
                toast.error("Please provide a complete delivery address");
                return;
            }
        }

        // Validate pickup fields
        if (deliveryType === "pickup") {
            if (!pickupInfo.name.trim() || !pickupInfo.phone.trim()) {
                toast.error("Please provide your name and phone number for pickup orders");
                return;
            }
        }

        setIsLoading(true);
        try {
            const isGuestOrder = !session?.user;
            const orderInput = {
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                totalAmount: total,
                paymentMethod,
                deliveryType,
                deliveryAddress: deliveryType === "delivery" ? {
                    ...deliveryAddress,
                    phone: guestInfo.phone,
                } : null,
                pickupBranchId: deliveryType === "pickup" ? "branch-1" : null,
                pickupName: deliveryType === "pickup" ? (pickupInfo.name || guestInfo.name) : undefined,
                pickupPhone: deliveryType === "pickup" ? (pickupInfo.phone || guestInfo.phone) : undefined,
                // Guest order fields
                guestEmail: isGuestOrder ? guestInfo.email : undefined,
                guestName: isGuestOrder ? guestInfo.name : undefined,
                guestPhone: isGuestOrder ? guestInfo.phone : undefined,
                guestSessionId: isGuestOrder ? getGuestSessionId() : undefined,
            };

            const result = await createOrder(orderInput);

            if (result.success) {
                toast.success(`Order placed successfully! Order #${result.orderNumber}`);
                if (deliveryType === "pickup" && result.verificationCode) {
                    toast.info(`Your pickup verification code: ${result.verificationCode}`, { duration: 10000 });
                }
                clearCart();
                router.push(`/order-confirmation?orderNumber=${result.orderNumber}`);
            } else {
                toast.error(result.error || "Failed to place order");
            }
        } catch (error) {
            console.error("Place order error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while session is being verified
    // Give extra time after OAuth redirects for session to be available
    const [hasInitialized, setHasInitialized] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    
    useEffect(() => {
        // Check if session exists in localStorage immediately
        if (typeof window !== "undefined") {
            const storedSession = localStorage.getItem("userSession");
            if (storedSession) {
                // If session exists in storage, don't wait for context
                setHasInitialized(true);
                return;
            }
        }
        
        // Otherwise wait for session context to finish loading
        if (!sessionLoading) {
            // If we have a session in context, we're good
            if (session?.user) {
                setHasInitialized(true);
                return;
            }
            
            // If no session and we haven't retried too many times, wait a bit longer (for OAuth)
            if (retryCount < 5) {
                const timer = setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, 500);
                return () => clearTimeout(timer);
            } else {
                // After 5 retries (2.5 seconds), give up and show the page
                // The redirect logic will handle sending to login if needed
                setHasInitialized(true);
            }
        }
    }, [sessionLoading, session, retryCount]);

    if (sessionLoading && !hasInitialized) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B9D] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading checkout...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Show empty cart message instead of returning null
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some items to your cart to proceed to checkout.</p>
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Guest Contact Information (Required for all orders) */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                {session?.user 
                                    ? `Logged in as ${session.user.name || session.user.email}` 
                                    : "Please provide your contact information to complete your order"}
                            </p>
                            {!session?.user && (
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Full Name *"
                                        value={guestInfo.name}
                                        onChange={(e) =>
                                            setGuestInfo({ ...guestInfo, name: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        type="email"
                                        placeholder="Email Address *"
                                        value={guestInfo.email}
                                        onChange={(e) =>
                                            setGuestInfo({ ...guestInfo, email: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        placeholder="Phone Number *"
                                        value={guestInfo.phone}
                                        onChange={(e) =>
                                            setGuestInfo({ ...guestInfo, phone: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Delivery Type Display (Read-only) */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Method</h2>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200">
                                {deliveryType === "delivery" ? (
                                    <>
                                        <FiTruck className="w-8 h-8 text-pink-600" />
                                        <div>
                                            <p className="font-bold text-gray-900">Home Delivery</p>
                                            <p className="text-sm text-gray-600">Free on orders Rs. 2000+</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <FiMapPin className="w-8 h-8 text-amber-600" />
                                        <div>
                                            <p className="font-bold text-gray-900">Store Pickup</p>
                                            <p className="text-sm text-gray-600">Ready in 30 minutes</p>
                                        </div>
                                    </>
                                )}
                                <Link 
                                    href="/order-type" 
                                    className="ml-auto text-sm text-pink-600 hover:text-pink-700 font-semibold underline"
                                >
                                    Change
                                </Link>
                            </div>
                        </div>

                        {/* Delivery Address Form */}
                        {deliveryType === "delivery" && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Street Address"
                                        value={deliveryAddress.street}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                                        }
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="City"
                                            value={deliveryAddress.city}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                                            }
                                        />
                                        <Input
                                            placeholder="State"
                                            value={deliveryAddress.state}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                                            }
                                        />
                                    </div>
                                    <Input
                                        placeholder="ZIP Code"
                                        value={deliveryAddress.zipCode}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pickup Information Form */}
                        {deliveryType === "pickup" && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Information</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please provide your name and phone number for order verification at pickup.
                                </p>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Full Name"
                                        value={pickupInfo.name}
                                        onChange={(e) =>
                                            setPickupInfo({ ...pickupInfo, name: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={pickupInfo.phone}
                                        onChange={(e) =>
                                            setPickupInfo({ ...pickupInfo, phone: e.target.value })
                                        }
                                        required
                                    />
                                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                        <p className="text-sm text-pink-800 font-semibold mb-2">
                                            🔒 Security Notice
                                        </p>
                                        <p className="text-xs text-pink-700">
                                            A unique verification code will be generated for your order. 
                                            Please bring this code and a valid ID when picking up your order.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                {["cash", "jazzcash", "easypaisa", "nayapay", "raast"].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                                            paymentMethod === method
                                                ? "border-pink-600 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FiCreditCard className="w-5 h-5 text-gray-600" />
                                                <span className="font-semibold capitalize">{method}</span>
                                            </div>
                                            {paymentMethod === method && (
                                                <FiCheck className="w-5 h-5 text-pink-600" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.product?.name || "Product"} x {item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            Rs. {(
                                                parseFloat(item.product?.price || "0") * item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
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
                                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="w-full mt-6 bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                            >
                                {isLoading ? "Processing..." : "Place Order"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

