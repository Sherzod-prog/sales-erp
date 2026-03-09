"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockProducts from "@/components/dashboard/LowStockProducts";
import SalesStatusChart from "@/components/dashboard/SalesStatusChart";
import OrdersTimelineChart from "@/components/dashboard/OrdersTimelineChart";
import { DashboardStats } from "@/types/dashboard";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/dashboard/stats", {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Dashboard statistikada xatolik");
            }

            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                Yuklanmoqda...
            </section>
        );
    }

    if (!stats) {
        return (
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
                Dashboard ma’lumotlarini olishda xatolik.
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-sm text-gray-500">
                    Umumiy statistika va oxirgi holatlar
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard title="Jami mahsulotlar" value={stats.totalProducts} />
                <StatCard title="Jami mijozlar" value={stats.totalCustomers} />
                <StatCard title="Jami orderlar" value={stats.totalOrders} />
                <StatCard title="Pending orderlar" value={stats.pendingOrders} />
                <StatCard title="Paid orderlar" value={stats.paidOrders} />
                <StatCard title="Cancelled orderlar" value={stats.cancelledOrders} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <SalesStatusChart data={stats.statusChart} />
                <OrdersTimelineChart data={stats.ordersTimeline} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <LowStockProducts products={stats.lowStockProducts} />
                <RecentOrders orders={stats.recentOrders} />
            </div>
        </section>
    );
}