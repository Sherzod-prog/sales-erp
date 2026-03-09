import { DashboardRecentOrder } from "@/types/dashboard";
import StatusBadge from "@/components/orders/StatusBadge";

type RecentOrdersProps = {
    orders: DashboardRecentOrder[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">So‘nggi orderlar</h3>
                <p className="text-sm text-gray-500">Oxirgi yaratilgan 5 ta buyurtma</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left">Mijoz</th>
                            <th className="px-3 py-2 text-left">Jami</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-left">Sana</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                                    Hozircha orderlar yo‘q
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b last:border-b-0">
                                    <td className="px-3 py-3">
                                        <div className="font-medium">{order.customer.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {order.customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">${order.total}</td>
                                    <td className="px-3 py-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-3 py-3">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}