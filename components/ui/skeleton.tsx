import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "circular" | "text" | "card";
    width?: string;
    height?: string;
}

export function Skeleton({
    className,
    variant = "default",
    width,
    height,
    ...props
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-800";
    
    const variantClasses = {
        default: "rounded-md",
        circular: "rounded-full",
        text: "rounded h-4",
        card: "rounded-lg",
    };

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                className
            )}
            style={{
                width: width || undefined,
                height: height || undefined,
            }}
            {...props}
        />
    );
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
    return (
        <div className="space-y-3">
            <Skeleton variant="card" className="h-64 w-full" />
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
        </div>
    );
}

export function SkeletonProductCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 p-5 space-y-4">
            <Skeleton variant="card" className="aspect-square w-full" />
            <div className="space-y-2">
                <Skeleton variant="text" className="w-3/4 h-6" />
                <Skeleton variant="text" className="w-1/2 h-4" />
            </div>
            <Skeleton variant="text" className="w-1/3 h-8" />
        </div>
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={i === lines - 1 ? "w-3/4" : "w-full"}
                />
            ))}
        </div>
    );
}

