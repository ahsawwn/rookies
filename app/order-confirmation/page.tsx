"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";
import { FiCheckCircle, FiTruck, FiMapPin, FiPackage, FiDownload, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

export default function OrderConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const confirmationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderNumber) {
                router.push("/");
                return;
            }

            try {
                const response = await fetch(`/api/orders/${orderNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data.order);
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber, router]);

    const handleDownloadImage = async () => {
        if (!confirmationRef.current) return;

        setIsDownloading(true);
        try {
            // Dynamically import html2canvas
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(confirmationRef.current, {
                backgroundColor: "#ffffff",
                scale: 2,
                logging: false,
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `order-${orderNumber}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success("Order confirmation downloaded!");
            });
        } catch (error) {
            console.error("Error downloading image:", error);
            toast.error("Failed to download image. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share && order) {
            try {
                await navigator.share({
                    title: `Order Confirmation - ${orderNumber}`,
                    text: `I just placed an order at ROOKIES Bakery! Order #${orderNumber}`,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled or error occurred
                console.log("Share cancelled");
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success("Order link copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading order confirmation...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const totalAmount = parseFloat(order.totalAmount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Download/Share Buttons */}
                <div className="flex justify-end gap-3 mb-6">
                    <Button
                        onClick={handleDownloadImage}
                        disabled={isDownloading}
                        variant="outline"
                        className="gap-2"
                    >
                        <FiDownload className="w-4 h-4" />
                        {isDownloading ? "Downloading..." : "Download"}
                    </Button>
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="gap-2"
                    >
                        <FiShare2 className="w-4 h-4" />
                        Share
                    </Button>
                </div>

                {/* Confirmation Card - Screenshot-friendly */}
                <div
                    ref={confirmationRef}
                    className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-8"
                    style={{ minHeight: "600px" }}
                >
                    {/* Header with Success Animation */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <FiCheckCircle className="w-14 h-14 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Thank you for your order. We're preparing it with love!
                        </p>
                        <div className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-full">
                            <p className="text-sm font-semibold uppercase tracking-wider mb-1">Order Number</p>
                            <p className="text-3xl sm:text-4xl font-black">{orderNumber}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                            Order Details
                        </h2>
                        <div className="space-y-4">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    {item.product?.image && (
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{item.product?.name || "Product"}</h3>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-gray-900">
                                            Rs. {(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-semibold">Rs. {totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span className="font-medium">Tax</span>
                                <span className="font-semibold">Rs. {(totalAmount * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="border-t-2 border-pink-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-pink-600">
                                        Rs. {totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery/Pickup Information */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            {order.deliveryType === "pickup" ? (
                                <>
                                    <FiMapPin className="w-6 h-6 text-amber-600" />
                                    <span>Pickup Information</span>
                                </>
                            ) : (
                                <>
                                    <FiTruck className="w-6 h-6 text-pink-600" />
                                    <span>Delivery Information</span>
                                </>
                            )}
                        </h2>
                        
                        {order.deliveryType === "pickup" ? (
                            <div className="bg-amber-50 rounded-xl p-6 space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-1">Pickup Name</p>
                                    <p className="text-lg font-bold text-gray-900">{order.pickupName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-1">Pickup Phone</p>
                                    <p className="text-lg font-bold text-gray-900">{order.pickupPhone || "N/A"}</p>
                                </div>
                                {order.pickupVerificationCode && (
                                    <div className="bg-white border-2 border-amber-300 rounded-xl p-6 text-center">
                                        <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">
                                            Verification Code
                                        </p>
                                        <p className="text-4xl font-black text-amber-600 mb-2">
                                            {order.pickupVerificationCode}
                                        </p>
                                        <p className="text-xs text-amber-600">
                                            Please bring this code and a valid ID when picking up your order.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-pink-50 rounded-xl p-6">
                                {order.deliveryAddress && typeof order.deliveryAddress === 'object' && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-gray-600 mb-2">Delivery Address</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {order.deliveryAddress.street || ""}
                                            {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                                            {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                                            {order.deliveryAddress.zipCode && ` ${order.deliveryAddress.zipCode}`}
                                        </p>
                                        {order.deliveryAddress.phone && (
                                            <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiPackage className="w-5 h-5 text-pink-600" />
                            Payment Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="font-bold text-gray-900 capitalize">{order.paymentMethod || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Order Status</p>
                                <p className={`font-bold capitalize ${
                                    order.status === "completed" ? "text-green-600" : 
                                    order.status === "processing" ? "text-blue-600" : 
                                    "text-yellow-600"
                                }`}>
                                    {order.status}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Message */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                    <p className="text-center text-blue-800 font-medium">
                        <strong>Note:</strong> We've sent a confirmation email with your order details. 
                        You can track your order status in your profile.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/profile?tab=orders">
                        <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-6 text-lg font-bold rounded-full">
                            View Orders
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline" className="px-8 py-6 text-lg font-semibold rounded-full border-2">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
