"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SalesChartProps {
    data?: Array<{ date: string; sales: number }>;
}

export function SalesChart({ data = [] }: SalesChartProps) {
    // Transform data for recharts
    const chartData = data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: item.sales,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Revenue trends over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#ec4899"
                                strokeWidth={2}
                                name="Sales (Rs.)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>No sales data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
