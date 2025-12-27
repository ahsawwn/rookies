"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiTruck, FiMapPin, FiCheck, FiArrowRight } from "react-icons/fi";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";

export default function OrderTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<"delivery" | "pickup" | null>(null);

    const handleContinue = () => {
        if (!selectedType) return;
        
        // Store selection in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("selectedDeliveryType", selectedType);
        }
        
        // Redirect to checkout (checkout page will handle empty cart)
        router.push(`/checkout?type=${selectedType}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                        How would you like to receive your order?
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
                        Choose your preferred delivery method to continue
                    </p>
                </div>

                {/* Delivery Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                    {/* Home Delivery Option */}
                    <button
                        onClick={() => setSelectedType("delivery")}
                        className={`relative p-8 rounded-3xl border-4 transition-all transform hover:scale-105 ${
                            selectedType === "delivery"
                                ? "border-pink-600 bg-gradient-to-br from-pink-50 to-rose-50 shadow-2xl"
                                : "border-gray-200 bg-white hover:border-pink-300 shadow-lg hover:shadow-xl"
                        }`}
                    >
                        {selectedType === "delivery" && (
                            <div className="absolute top-4 right-4 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                                <FiCheck className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                selectedType === "delivery" 
                                    ? "bg-pink-600 text-white" 
                                    : "bg-pink-100 text-pink-600"
                            }`}>
                                <FiTruck className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                Home Delivery
                            </h2>
                            <p className="text-gray-600 mb-4 text-base sm:text-lg">
                                Get your fresh baked goods delivered right to your doorstep
                            </p>
                            <div className="space-y-2 text-left max-w-xs mx-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>Free delivery on orders Rs. 2000+</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>Fast and reliable service</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>Track your order in real-time</span>
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* Store Pickup Option */}
                    <button
                        onClick={() => setSelectedType("pickup")}
                        className={`relative p-8 rounded-3xl border-4 transition-all transform hover:scale-105 ${
                            selectedType === "pickup"
                                ? "border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl"
                                : "border-gray-200 bg-white hover:border-amber-300 shadow-lg hover:shadow-xl"
                        }`}
                    >
                        {selectedType === "pickup" && (
                            <div className="absolute top-4 right-4 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                                <FiCheck className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                selectedType === "pickup" 
                                    ? "bg-amber-600 text-white" 
                                    : "bg-amber-100 text-amber-600"
                            }`}>
                                <FiMapPin className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                Store Pickup
                            </h2>
                            <p className="text-gray-600 mb-4 text-base sm:text-lg">
                                Pick up your order from our bakery location
                            </p>
                            <div className="space-y-2 text-left max-w-xs mx-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>Ready in 30 minutes</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>No delivery charges</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-green-600">✓</span>
                                    <span>Fresh from the oven</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedType}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-10 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Continue
                        <FiArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Link href="/shop">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-lg font-semibold rounded-full"
                        >
                            Browse Menu First
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

