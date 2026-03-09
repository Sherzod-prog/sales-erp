"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { StatusChartItem } from "@/types/dashboard";

type SalesStatusChartProps = {
    data: StatusChartItem[];
};

export default function SalesStatusChart({
    data,
}: SalesStatusChartProps) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Order status statistikasi</h3>
                <p className="text-sm text-gray-500">
                    Pending, paid va cancelled holatlar
                </p>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}