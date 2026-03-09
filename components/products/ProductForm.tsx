"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

type ProductFormProps = {
    onSaved: () => void;
    editingProduct: Product | null;
    onCancelEdit: () => void;
};

export default function ProductForm({
    onSaved,
    editingProduct,
    onCancelEdit,
}: ProductFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name);
            setDescription(editingProduct.description || "");
            setPrice(String(editingProduct.price));
            setStock(String(editingProduct.stock));
        } else {
            resetForm();
        }
    }, [editingProduct]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const isEdit = Boolean(editingProduct);

            const res = await fetch(
                isEdit ? `/api/products/${editingProduct?.id}` : "/api/products",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price: Number(price),
                        stock: Number(stock),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Xatolik yuz berdi");
            }

            resetForm();
            onSaved();

            if (isEdit) {
                onCancelEdit();
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Noma’lum xatolik");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-5 shadow-sm"
        >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
                </h2>

                {editingProduct ? (
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            onCancelEdit();
                        }}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        Bekor qilish
                    </button>
                ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">Nomi</label>
                    <input
                        type="text"
                        placeholder="Masalan: iPhone 15"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Narxi</label>
                    <input
                        type="number"
                        placeholder="1200"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Stock</label>
                    <input
                        type="number"
                        placeholder="10"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Tavsif</label>
                    <input
                        type="text"
                        placeholder="256GB, Black"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>
            </div>

            {error ? (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            ) : null}

            <button
                type="submit"
                disabled={loading}
                className="mt-4 rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
            >
                {loading
                    ? editingProduct
                        ? "Saqlanmoqda..."
                        : "Yaratilmoqda..."
                    : editingProduct
                        ? "Yangilash"
                        : "Saqlash"}
            </button>
        </form>
    );
}