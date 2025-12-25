import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AdminCardProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

export function AdminCard({ children, className, header, footer }: AdminCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-lg border border-gray-200 shadow-sm",
                className
            )}
        >
            {header && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {header}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
}

