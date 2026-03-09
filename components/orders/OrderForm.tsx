"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Customer } from "@/types/customer";

type SelectedItem = {
    productId: string;
    quantity: number;
};

type OrderFormProps = {
    onCreated: () => void;
};

export default function OrderForm({ onCreated }: OrderFormProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customerId, setCustomerId] = useState("");
    const [items, setItems] = useState<SelectedItem[]>([
        { productId: "", quantity: 1 },
    ]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setFetching(true);

            const [customersRes, productsRes] = await Promise.all([
                fetch("/api/customers", { cache: "no-store" }),
                fetch("/api/products", { cache: "no-store" }),
            ]);

            const customersData = await customersRes.json();
            const productsData = await productsRes.json();

            if (!customersRes.ok) {
                throw new Error(customersData.message || "Mijozlarni olishda xatolik");
            }

            if (!productsRes.ok) {
                throw new Error(productsData.message || "Mahsulotlarni olishda xatolik");
            }

            setCustomers(customersData);
            setProducts(productsData);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Xatolik yuz berdi");
            }
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addItem = () => {
        setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const updateItem = (
        index: number,
        key: "productId" | "quantity",
        value: string
    ) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [key]: key === "quantity" ? Number(value) : value,
                    }
                    : item
            )
        );
    };

    const resetForm = () => {
        setCustomerId("");
        setItems([{ productId: "", quantity: 1 }]);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerId,
                    items,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Order yaratishda xatolik");
            }

            resetForm();
            onCreated();
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
            className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm"
        >
            <div>
                <h2 className="text-lg font-semibold">Yangi order yaratish</h2>
                <p className="text-sm text-gray-500">
                    Mijoz va mahsulotlarni tanlang
                </p>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Mijoz</label>
                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                    disabled={fetching}
                >
                    <option value="">Mijozni tanlang</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name} ({customer.phone})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_140px_120px]"
                    >
                        <select
                            value={item.productId}
                            onChange={(e) => updateItem(index, "productId", e.target.value)}
                            className="rounded-lg border px-3 py-2"
                            disabled={fetching}
                        >
                            <option value="">Mahsulotni tanlang</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} (${product.price}) — stock: {product.stock}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            className="rounded-lg border px-3 py-2"
                            placeholder="Soni"
                        />

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="rounded-lg border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                            O‘chirish
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={addItem}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                    Mahsulot qo‘shish
                </button>

                <button
                    type="submit"
                    disabled={loading || fetching}
                    className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? "Saqlanmoqda..." : "Order yaratish"}
                </button>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
    );
}