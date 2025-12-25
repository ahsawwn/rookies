import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./Card";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface DashboardStatProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: ReactNode;
    color?: "pink" | "blue" | "green" | "amber";
}

export function DashboardStat({
    title,
    value,
    change,
    changeLabel,
    icon,
    color = "pink",
}: DashboardStatProps) {
    const colors = {
        pink: "bg-pink-100 text-pink-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        amber: "bg-amber-100 text-amber-600",
    };

    return (
        <AdminCard>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                            {change >= 0 ? (
                                <FiTrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                                <FiTrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    change >= 0 ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {Math.abs(change)}% {changeLabel || "vs last period"}
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colors[color])}>
                        {icon}
                    </div>
                )}
            </div>
        </AdminCard>
    );
}

