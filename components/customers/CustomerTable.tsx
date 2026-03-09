"use client";

import { Customer } from "@/types/customer";

type CustomerTableProps = {
    customers: Customer[];
    onDeleted: () => void;
    onEdit: (customer: Customer) => void;
};

export default function CustomerTable({
    customers,
    onDeleted,
    onEdit,
}: CustomerTableProps) {
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Mijozni o‘chirmoqchimisiz?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "O‘chirishda xatolik");
            }

            onDeleted();
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Noma’lum xatolik");
            }
        }
    };

    return (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Ismi</th>
                        <th className="px-4 py-3 text-left font-semibold">Telefon</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                Hozircha mijozlar yo‘q
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => (
                            <tr key={customer.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3">{customer.name}</td>
                                <td className="px-4 py-3">{customer.phone}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:opacity-90"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:opacity-90"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}