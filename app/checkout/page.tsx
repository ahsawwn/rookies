"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const { session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"delivery" | "payment" | "review">("delivery");

    // Delivery form state
    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
    });
    
    // Pickup form state
    const [pickupInfo, setPickupInfo] = useState({
        name: "",
        phone: "",
    });

    // Payment form state
    const [paymentMethod, setPaymentMethod] = useState("cash");

    // Redirect to login if no session and cart has items
    useEffect(() => {
        if (!session?.user && items.length > 0) {
            if (typeof window !== "undefined") {
                localStorage.setItem("redirectAfterLogin", "/checkout");
            }
            router.push("/login");
        }
    }, [session, items.length, router]);

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    const subtotal = getTotal();
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping on orders Rs. 2000+
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        if (!session?.user) {
            toast.error("Please log in to place an order");
            // Store redirect URL for after login
            if (typeof window !== "undefined") {
                localStorage.setItem("redirectAfterLogin", "/checkout");
            }
            router.push("/login");
            return;
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
            const orderInput = {
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                totalAmount: total,
                paymentMethod,
                deliveryType,
                deliveryAddress: deliveryType === "delivery" ? deliveryAddress : null,
                pickupBranchId: deliveryType === "pickup" ? "branch-1" : null,
                pickupName: deliveryType === "pickup" ? pickupInfo.name : undefined,
                pickupPhone: deliveryType === "pickup" ? pickupInfo.phone : undefined,
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

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Type Selection */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Method</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDeliveryType("delivery")}
                                    className={`p-4 border-2 rounded-lg transition-all ${
                                        deliveryType === "delivery"
                                            ? "border-pink-600 bg-pink-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <FiTruck className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                                    <p className="font-semibold">Home Delivery</p>
                                    <p className="text-sm text-gray-600">Free on orders Rs. 2000+</p>
                                </button>
                                <button
                                    onClick={() => setDeliveryType("pickup")}
                                    className={`p-4 border-2 rounded-lg transition-all ${
                                        deliveryType === "pickup"
                                            ? "border-pink-600 bg-pink-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <FiMapPin className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                                    <p className="font-semibold">Store Pickup</p>
                                    <p className="text-sm text-gray-600">Ready in 30 minutes</p>
                                </button>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="ZIP Code"
                                            value={deliveryAddress.zipCode}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                                            }
                                        />
                                        <Input
                                            placeholder="Phone Number"
                                            value={deliveryAddress.phone}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })
                                            }
                                        />
                                    </div>
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
                                            $
                                            {(
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
                                disabled={isLoading || !session?.user}
                                className="w-full mt-6 bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                            >
                                {isLoading ? "Processing..." : session?.user ? "Place Order" : "Please Log In"}
                            </Button>
                            {!session?.user && (
                                <p className="text-sm text-gray-600 mt-4 text-center">
                                    Please{" "}
                                    <a 
                                        href="/login" 
                                        className="text-pink-600 hover:underline font-semibold"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (typeof window !== "undefined") {
                                                localStorage.setItem("redirectAfterLogin", "/checkout");
                                            }
                                            router.push("/login");
                                        }}
                                    >
                                        log in
                                    </a>{" "}
                                    to place an order
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

