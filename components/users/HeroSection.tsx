"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiCoffee } from 'react-icons/fi';

export default function HeroSection() {
    return (
        <section className="relative w-full bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
                            <span className="text-lg">🍪</span>
                            <span className="text-sm font-medium text-gray-700">Fresh Baked Daily</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-6 leading-tight">
                            Home-Based Bakery
                            <span className="block text-[#FF6B9D] mt-2">From Pakistan</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the authentic taste of freshly baked cookies, shakes, cupcakes, cakes, croissants, and breads. 
                            Every item is made with love in our home kitchen using premium ingredients.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <Link href="/shop" className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    Order Now
                                    <FiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </Link>
                            <Link href="/shop" className="w-full sm:w-auto">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="w-full sm:w-auto border-2 border-black text-black hover:bg-black hover:text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full"
                                >
                                    View Menu
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start">
                            <div>
                                <div className="text-3xl font-bold text-black">100+</div>
                                <div className="text-sm text-gray-600">Happy Customers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-black">50+</div>
                                <div className="text-sm text-gray-600">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-black">Fresh</div>
                                <div className="text-sm text-gray-600">Daily Baking</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square">
                            {/* SVG Illustration - Cartoon Cookie */}
                            <svg
                                viewBox="0 0 400 400"
                                className="w-full h-full"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Cookie Base */}
                                <ellipse cx="200" cy="200" rx="180" ry="160" fill="#D4A574" stroke="#B8956A" strokeWidth="4"/>
                                
                                {/* Chocolate Chips */}
                                <circle cx="150" cy="150" r="12" fill="#5D4037"/>
                                <circle cx="250" cy="150" r="12" fill="#5D4037"/>
                                <circle cx="180" cy="200" r="12" fill="#5D4037"/>
                                <circle cx="220" cy="200" r="12" fill="#5D4037"/>
                                <circle cx="150" cy="250" r="12" fill="#5D4037"/>
                                <circle cx="250" cy="250" r="12" fill="#5D4037"/>
                                <circle cx="200" cy="180" r="10" fill="#5D4037"/>
                                <circle cx="200" cy="220" r="10" fill="#5D4037"/>
                                
                                {/* Face - Happy Cookie */}
                                <circle cx="170" cy="170" r="8" fill="#000"/>
                                <circle cx="230" cy="170" r="8" fill="#000"/>
                                <path d="M 170 200 Q 200 220 230 200" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round"/>
                                
                                {/* Decorative Elements */}
                                <circle cx="120" cy="120" r="6" fill="#FF6B9D" opacity="0.6"/>
                                <circle cx="280" cy="120" r="6" fill="#FF6B9D" opacity="0.6"/>
                                <circle cx="120" cy="280" r="6" fill="#FF6B9D" opacity="0.6"/>
                                <circle cx="280" cy="280" r="6" fill="#FF6B9D" opacity="0.6"/>
                            </svg>
                        </div>
                    </div>

                    {/* Mobile: Simplified Illustration */}
                    <div className="lg:hidden flex justify-center mt-8">
                        <div className="w-64 h-64 relative">
                            <svg
                                viewBox="0 0 200 200"
                                className="w-full h-full"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse cx="100" cy="100" rx="90" ry="80" fill="#D4A574" stroke="#B8956A" strokeWidth="3"/>
                                <circle cx="75" cy="75" r="6" fill="#5D4037"/>
                                <circle cx="125" cy="75" r="6" fill="#5D4037"/>
                                <circle cx="90" cy="100" r="6" fill="#5D4037"/>
                                <circle cx="110" cy="100" r="6" fill="#5D4037"/>
                                <circle cx="75" cy="125" r="6" fill="#5D4037"/>
                                <circle cx="125" cy="125" r="6" fill="#5D4037"/>
                                <circle cx="85" cy="85" r="4" fill="#000"/>
                                <circle cx="115" cy="85" r="4" fill="#000"/>
                                <path d="M 85 100 Q 100 110 115 100" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16 lg:h-20">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
}
