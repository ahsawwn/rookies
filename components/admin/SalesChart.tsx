"use client";

import { AdminCard } from "./Card";

interface SalesChartProps {
    data?: Array<{ date: string; sales: number }>;
}

export function SalesChart({ data = [] }: SalesChartProps) {
    // Simple bar chart representation
    const maxSales = Math.max(...data.map((d) => d.sales), 0) || 1;

    return (
        <AdminCard
            header={<h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>}
        >
            <div className="space-y-4">
                {data.length > 0 ? (
                    <div className="flex items-end justify-between gap-2 h-64">
                        {data.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end justify-center" style={{ height: "200px" }}>
                                    <div
                                        className="w-full bg-gradient-to-t from-pink-600 to-rose-600 rounded-t-lg hover:from-pink-700 hover:to-rose-700 transition-colors"
                                        style={{
                                            height: `${(item.sales / maxSales) * 100}%`,
                                            minHeight: item.sales > 0 ? "4px" : "0",
                                        }}
                                    />
                                </div>
                                <div className="text-xs text-gray-600 text-center">
                                    {new Date(item.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                <div className="text-xs font-semibold text-gray-900">
                                    ${item.sales.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>No sales data available</p>
                    </div>
                )}
            </div>
        </AdminCard>
    );
}

