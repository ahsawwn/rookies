"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Slide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    overlayGradient?: string;
}

interface HeroCarouselProps {
    slides: Slide[];
    autoRotateInterval?: number; // in milliseconds
}

export function HeroCarousel({
    slides,
    autoRotateInterval = 5000,
}: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (isPaused || slides.length <= 1) return;

        const interval = setInterval(nextSlide, autoRotateInterval);
        return () => clearInterval(interval);
    }, [isPaused, nextSlide, autoRotateInterval, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div
            className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        {/* Background Image */}
                        <div className="relative w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Gradient Overlay */}
                            <div
                                className={`absolute inset-0 ${
                                    slide.overlayGradient ||
                                    "bg-gradient-to-r from-black/60 via-black/40 to-transparent"
                                }`}
                            />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                <div className="max-w-2xl">
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.ctaLink}
                                        className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        {slide.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        aria-label="Next slide"
                    >
                        <FiChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

