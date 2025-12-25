import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "outline";
    isLoading?: boolean;
    icon?: ReactNode;
}

export function AdminButton({
    variant = "primary",
    isLoading = false,
    icon,
    children,
    className,
    disabled,
    ...props
}: AdminButtonProps) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        outline: "border-2 border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}

