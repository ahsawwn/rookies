"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FiArrowRight } from 'react-icons/fi';
import { getFeaturedProducts } from '@/server/products';

export default function HeroSection() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    useEffect(() => {
        // Fetch featured products
        getFeaturedProducts(6).then((result) => {
            if (result.success && result.products) {
                setFeaturedProducts(result.products);
            }
        });
    }, []);

    // Auto-rotate product carousel
    useEffect(() => {
        if (featuredProducts.length > 1) {
            const interval = setInterval(() => {
                setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [featuredProducts.length]);

    return (
        <section className="relative w-full bg-gradient-to-br from-pink-100 via-rose-50 via-amber-50 to-pink-200 overflow-hidden min-h-[90vh] flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Biscuits/Cookies */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${(i * 8.33) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + (i % 3)}s`,
                        }}
                    >
                        <div className="text-4xl sm:text-5xl md:text-6xl opacity-20 animate-spin-slow">
                            {['🍪', '🧁', '🍰', '🥐', '🥨', '🍩'][i % 6]}
                        </div>
                    </div>
                ))}
                
                {/* Animated Sprinkles/Stars */}
                {[...Array(20)].map((_, i) => {
                    // Use deterministic values based on index to avoid hydration mismatch
                    // Simple hash function to generate pseudo-random but consistent values
                    const seed = i * 137.508; // Golden angle approximation
                    const left = ((Math.sin(seed) * 0.5 + 0.5) * 100) % 100;
                    const top = ((Math.cos(seed * 0.7) * 0.5 + 0.5) * 100) % 100;
                    const delay = ((Math.sin(seed * 1.3) * 0.5 + 0.5) * 2);
                    const duration = 2 + ((Math.cos(seed * 0.9) * 0.5 + 0.5) * 2);
                    
                    return (
                        <div
                            key={`sprinkle-${i}`}
                            className="absolute w-2 h-2 rounded-full animate-twinkle"
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                backgroundColor: ['#FF6B9D', '#FFB6C1', '#FFD700', '#FFA500', '#FF69B4'][i % 5],
                                animationDelay: `${delay}s`,
                                animationDuration: `${duration}s`,
                            }}
                        />
                    );
                })}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-pink-200 mb-6 animate-fade-in">
                            <span className="text-2xl animate-bounce">🍪</span>
                            <span className="text-sm font-bold text-pink-700">Fresh Baked Daily</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight animate-slide-up">
                            <span className="block bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                                Freshly Baked
                            </span>
                            <span className="block text-[#1a1a1a] mt-2">Happiness</span>
                        </h1>

                        {/* Weekly Rotating Flavors */}
                        <div className="mb-6 animate-slide-up-delay">
                            <p className="text-sm font-bold text-pink-700 uppercase tracking-wider mb-2">
                                This Week's Special
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-800">
                                Chocolate Chip • Red Velvet • Oatmeal Raisin
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-slide-up-delay-2">
                            Experience the authentic taste of freshly baked cookies, shakes, cupcakes, cakes, croissants, and breads. 
                            Every item is made with love in our home kitchen using premium ingredients.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slide-up-delay-3">
                            <Link href="/order-type" className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
                                >
                                    Order Now
                                    <FiArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                                </Button>
                            </Link>
                            <Link href="/shop" className="w-full sm:w-auto">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="w-full sm:w-auto border-3 border-gray-800 bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-gray-800 hover:text-white px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-bold rounded-full transition-all shadow-lg"
                                >
                                    View Menu
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start animate-fade-in-delay">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                                <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">100+</div>
                                <div className="text-sm font-semibold text-gray-700">Happy Customers</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                                <div className="text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">50+</div>
                                <div className="text-sm font-semibold text-gray-700">Products</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                                <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Fresh</div>
                                <div className="text-sm font-semibold text-gray-700">Daily Baking</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Carousel */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-rose-200">
                            {featuredProducts.length > 0 ? (
                                <>
                                    {featuredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                                index === currentProductIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                        >
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                                                <p className="text-lg font-semibold">Rs. {parseFloat(product.price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Carousel Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                        {featuredProducts.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentProductIndex(index)}
                                                className={`w-3 h-3 rounded-full transition-all ${
                                                    index === currentProductIndex
                                                        ? 'bg-white w-8'
                                                        : 'bg-white/50 hover:bg-white/75'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-6xl animate-spin-slow">🍪</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile: Product Carousel */}
                    <div className="lg:hidden flex justify-center mt-8">
                        <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-pink-100 to-rose-200">
                            {featuredProducts.length > 0 ? (
                                <>
                                    {featuredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                                index === currentProductIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                        >
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                                                <p className="text-base font-semibold">Rs. {parseFloat(product.price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-5xl animate-spin-slow">🍪</div>
                                </div>
                            )}
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
