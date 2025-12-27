"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FiArrowRight } from 'react-icons/fi';

// Dynamically import Sprinkles with SSR disabled to prevent hydration mismatch
const Sprinkles = dynamic(() => import('./Sprinkles'), { 
    ssr: false,
    loading: () => null
});

export default function HeroSection() {
    return (
        <section className="relative w-full bg-gradient-to-br from-[#DFEFFF] via-[#CDD6DA] to-[#DFEFFF] overflow-hidden min-h-[90vh] flex items-center">
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
                
                {/* Animated Sprinkles/Stars - Client-only to avoid hydration mismatch */}
                <Sprinkles />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#CDD6DA] mb-6 animate-fade-in">
                            <span className="text-2xl animate-bounce">🍪</span>
                            <span className="text-sm font-bold text-[#000096]">Fresh Baked Daily</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight animate-slide-up">
                            <span className="block text-[#000096]">
                                Artisan Happiness,
                            </span>
                            <span className="block text-[#000096] mt-2">
                                Baked Fresh in Islamabad
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-slide-up-delay-2">
                            Experience the authentic taste of freshly baked cookies, shakes, cupcakes, cakes, croissants, and breads. 
                            Every item is made with love in our home kitchen using premium ingredients.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slide-up-delay-3">
                            <Link href="/order-inquiry" className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105"
                                >
                                    Order This Week's Menu
                                    <FiArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                                </Button>
                            </Link>
                            <a href="#about" className="w-full sm:w-auto">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="w-full sm:w-auto border-2 border-[#000096] bg-white/80 backdrop-blur-sm text-[#000096] hover:bg-[#000096] hover:text-white px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-bold rounded-full transition-all shadow-lg"
                                >
                                    See Our Story
                                </Button>
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start animate-fade-in-delay">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-[#CDD6DA]">
                                <div className="text-4xl font-black text-[#000096]">100+</div>
                                <div className="text-sm font-semibold text-gray-700">Happy Customers</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-[#CDD6DA]">
                                <div className="text-4xl font-black text-[#FF0000]">50+</div>
                                <div className="text-sm font-semibold text-gray-700">Products</div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-[#CDD6DA]">
                                <div className="text-4xl font-black text-[#000096]">Fresh</div>
                                <div className="text-sm font-semibold text-gray-700">Daily Baking</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero Image/Video Placeholder */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#DFEFFF] to-[#CDD6DA] border-2 border-[#CDD6DA]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-9xl opacity-30">🍰</div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-sm font-semibold opacity-90">Video or high-quality image slider can be added here</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Hero Image Placeholder */}
                    <div className="lg:hidden flex justify-center mt-8">
                        <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#DFEFFF] to-[#CDD6DA] border-2 border-[#CDD6DA]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-7xl opacity-30">🍰</div>
                            </div>
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
