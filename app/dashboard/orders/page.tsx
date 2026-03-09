"use client";

import { useEffect, useMemo, useState } from "react";
import OrderForm from "@/components/orders/OrderForm";
import OrderTable from "@/components/orders/OrderTable";
import { Order } from "@/types/order";
import { useMe } from "@/hooks/useMe";

type StatusFilter = "ALL" | "PENDING" | "PAID" | "CANCELLED";

export default function OrdersPage() {

  const { user } = useMe();
  const canCreateOrder = user?.role === "ADMIN" || user?.role === "MANAGER";
  const canManageOrderStatus = user?.role === "ADMIN";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Orderlarni olishda xatolik");
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (order) =>
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.toLowerCase().includes(q) ||
          order.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return result;
  }, [orders, search, statusFilter]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-sm text-gray-500">
          Buyurtmalarni boshqarish sahifasi
        </p>
      </div>

      {canCreateOrder ? (
        <OrderForm onCreated={fetchOrders} />
      ) : (
        <div className="rounded-2xl border bg-white p-4 text-sm text-gray-500 shadow-sm">
          Siz order yarata olmaysiz.
        </div>
      )}

      <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          type="text"
          placeholder="Order qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="ALL">Barcha statuslar</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          Yuklanmoqda...
        </div>
      ) : (
        <OrderTable orders={filteredOrders} onChanged={fetchOrders} canManageStatus={canManageOrderStatus}
        />
      )}
    </section>
  );
}