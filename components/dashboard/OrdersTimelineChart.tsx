"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { OrdersTimelineItem } from "@/types/dashboard";

type OrdersTimelineChartProps = {
    data: OrdersTimelineItem[];
};

export default function OrdersTimelineChart({
    data,
}: OrdersTimelineChartProps) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Oxirgi 7 kun buyurtmalari</h3>
                <p className="text-sm text-gray-500">
                    Kunlar bo‘yicha order soni
                </p>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}