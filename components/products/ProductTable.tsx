"use client";

import { Product } from "@/types/product";

type ProductTableProps = {
    products: Product[];
    onDeleted: () => void;
    onEdit: (product: Product) => void;
    canManage?: boolean;
};

export default function ProductTable({
    products,
    onDeleted, onEdit,
    canManage = false,

}: ProductTableProps) {
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Mahsulotni o‘chirmoqchimisiz?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
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
                        <th className="px-4 py-3 text-left font-semibold">Nomi</th>
                        <th className="px-4 py-3 text-left font-semibold">Tavsif</th>
                        <th className="px-4 py-3 text-left font-semibold">Narxi</th>
                        <th className="px-4 py-3 text-left font-semibold">Stock</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                Hozircha mahsulotlar yo‘q
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3">{product.name}</td>
                                <td className="px-4 py-3">{product.description || "-"}</td>
                                <td className="px-4 py-3">${product.price}</td>
                                <td className="px-4 py-3">{product.stock}</td>
                                <td className="px-4 py-3">
                                    {canManage ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:opacity-90"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:opacity-90"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">Faqat ADMIN</span>
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