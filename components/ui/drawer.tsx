"use client";

import { ReactNode, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Drawer({
    isOpen,
    onClose,
    title,
    children,
    side = "right",
    size = "md",
}: DrawerProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: side === "left" || side === "right" ? "w-80" : "h-64",
        md: side === "left" || side === "right" ? "w-96" : "h-96",
        lg: side === "left" || side === "right" ? "w-[32rem]" : "h-[32rem]",
        xl: side === "left" || side === "right" ? "w-[42rem]" : "h-[42rem]",
        full: side === "left" || side === "right" ? "w-full" : "h-full",
    };

    const sideClasses = {
        left: "left-0 top-0 bottom-0",
        right: "right-0 top-0 bottom-0",
        top: "top-0 left-0 right-0",
        bottom: "bottom-0 left-0 right-0",
    };

    const animationClasses = {
        left: isOpen ? "translate-x-0" : "-translate-x-full",
        right: isOpen ? "translate-x-0" : "translate-x-full",
        top: isOpen ? "translate-y-0" : "-translate-y-full",
        bottom: isOpen ? "translate-y-0" : "translate-y-full",
    };

    return (
        <div
            className="fixed inset-0 z-50"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
            />
            
            {/* Drawer Panel */}
            <div
                className={cn(
                    "absolute bg-white shadow-2xl transition-transform duration-300 ease-out",
                    sideClasses[side],
                    sizeClasses[size],
                    animationClasses[side]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close drawer"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                )}
                
                {/* Content */}
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

