"use client";

import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";

type CustomerFormProps = {
    onSaved: () => void;
    editingCustomer: Customer | null;
    onCancelEdit: () => void;
};

export default function CustomerForm({
    onSaved,
    editingCustomer,
    onCancelEdit,
}: CustomerFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setName("");
        setPhone("");
        setError("");
    };

    useEffect(() => {
        if (editingCustomer) {
            setName(editingCustomer.name);
            setPhone(editingCustomer.phone);
        } else {
            resetForm();
        }
    }, [editingCustomer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const isEdit = Boolean(editingCustomer);

            const res = await fetch(
                isEdit
                    ? `/api/customers/${editingCustomer?.id}`
                    : "/api/customers",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        phone,
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
                    {editingCustomer ? "Mijozni tahrirlash" : "Yangi mijoz qo‘shish"}
                </h2>

                {editingCustomer ? (
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
                    <label className="mb-1 block text-sm font-medium">Ismi</label>
                    <input
                        type="text"
                        placeholder="Ali Valiyev"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Telefon</label>
                    <input
                        type="text"
                        placeholder="+998901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    ? editingCustomer
                        ? "Saqlanmoqda..."
                        : "Yaratilmoqda..."
                    : editingCustomer
                        ? "Yangilash"
                        : "Saqlash"}
            </button>
        </form>
    );
}