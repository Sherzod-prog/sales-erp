import { OrderStatus } from "@/types/order";

export default function StatusBadge({ status }: { status: OrderStatus }) {
    const styles =
        status === "PAID"
            ? "bg-green-100 text-green-700"
            : status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
            {status}
        </span>
    );
}