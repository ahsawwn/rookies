"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    className,
}: OTPInputProps) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, newValue: string) => {
        // Only allow digits
        if (newValue && !/^\d$/.test(newValue)) {
            return;
        }

        const newOTP = value.split("");
        newOTP[index] = newValue;
        const updatedOTP = newOTP.join("").slice(0, length);
        onChange(updatedOTP);

        // Auto-focus next input
        if (newValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            setFocusedIndex(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // If current input is empty, focus previous and clear it
                inputRefs.current[index - 1]?.focus();
                setFocusedIndex(index - 1);
                const newOTP = value.split("");
                newOTP[index - 1] = "";
                onChange(newOTP.join(""));
            } else {
                // Clear current input
                const newOTP = value.split("");
                newOTP[index] = "";
                onChange(newOTP.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
            setFocusedIndex(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            setFocusedIndex(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);
        if (/^\d+$/.test(pastedData)) {
            onChange(pastedData);
            // Focus the last filled input or the last input
            const focusIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[focusIndex]?.focus();
            setFocusedIndex(focusIndex);
        }
    };

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    onFocus={() => setFocusedIndex(index)}
                    disabled={disabled}
                    className={cn(
                        "w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        focusedIndex === index
                            ? "border-pink-500 bg-pink-50/50"
                            : "border-gray-200 hover:border-pink-200",
                        value[index]
                            ? "bg-white border-pink-300"
                            : "bg-gray-50"
                    )}
                />
            ))}
        </div>
    );
}

