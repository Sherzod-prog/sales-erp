"use client";

import { Order } from "@/types/order";
import StatusBadge from "./StatusBadge";

type OrderTableProps = {
    orders: Order[];
    onChanged: () => void;
    canManageStatus: boolean;

};

export default function OrderTable({ orders, onChanged, canManageStatus }: OrderTableProps) {
    const handlePay = async (id: string) => {
        try {
            const res = await fetch(`/api/orders/${id}/pay`, {
                method: "PATCH",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "PAID qilishda xatolik");
            }

            onChanged();
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Xatolik yuz berdi");
            }
        }
    };

    const handleCancel = async (id: string) => {
        const reason = window.prompt("Bekor qilish sababi", "Mijoz fikridan qaytdi");
        if (reason === null) return;

        try {
            const res = await fetch(`/api/orders/${id}/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reason }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Cancel qilishda xatolik");
            }

            onChanged();
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Xatolik yuz berdi");
            }
        }
    };

    return (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Mijoz</th>
                        <th className="px-4 py-3 text-left font-semibold">Mahsulotlar</th>
                        <th className="px-4 py-3 text-left font-semibold">Jami</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Sana</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                Hozircha orderlar yo‘q
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="border-b align-top last:border-b-0">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{order.customer.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {order.customer.phone}
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="text-sm">
                                                {item.product.name} × {item.quantity}
                                            </div>
                                        ))}
                                    </div>
                                    {order.status === "CANCELLED" && order.cancelReason ? (
                                        <div className="mt-2 text-xs text-red-600">
                                            Sabab: {order.cancelReason}
                                        </div>
                                    ) : null}
                                </td>

                                <td className="px-4 py-3 font-medium">${order.total}</td>

                                <td className="px-4 py-3">
                                    <StatusBadge status={order.status} />
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3">
                                    {order.status === "PENDING" ? (
                                        canManageStatus ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePay(order.id)}
                                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-white hover:opacity-90"
                                                >
                                                    Pay
                                                </button>

                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:opacity-90"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Faqat ADMIN</span>
                                        )
                                    ) : (
                                        <span className="text-xs text-gray-400">Action yo‘q</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}