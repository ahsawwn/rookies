"use client";

import { useState } from "react";
import Image from "next/image";
import { FiZoomIn } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    mainImage: string;
    images?: string[] | null;
    productName: string;
}

export function ProductImageGallery({
    mainImage,
    images = [],
    productName,
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(mainImage);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imageError, setImageError] = useState(false);

    const allImages = [mainImage, ...(images || [])].filter(Boolean);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 group cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onClick={() => setIsZoomed(!isZoomed)}
            >
                {!imageError ? (
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500",
                            isZoomed && "scale-150"
                        )}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl">🍪</span>
                    </div>
                )}

                {/* Zoom Indicator */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/0 flex items-center justify-center transition-opacity duration-300",
                        isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100"
                    )}
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <FiZoomIn className="w-6 h-6 text-gray-700" />
                    </div>
                </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedImage(image);
                                setImageError(false);
                            }}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                selectedImage === image
                                    ? "border-pink-500 scale-105"
                                    : "border-gray-200 hover:border-pink-300"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${productName} view ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

