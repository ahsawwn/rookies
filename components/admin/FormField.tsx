import { ReactNode, InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    label?: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

