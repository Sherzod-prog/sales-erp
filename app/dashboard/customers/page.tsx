"use client";

import { useEffect, useMemo, useState } from "react";
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";
import { Customer } from "@/types/customer";
import { useMe } from "@/hooks/useMe";

type SortOption = "NEWEST" | "NAME_ASC";

export default function CustomersPage() {

    const { user } = useMe();
    const isAdmin = user?.role === "ADMIN";

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("NEWEST");

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/customers", {
                cache: "no-store",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Mijozlarni olishda xatolik");
            }

            setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        let result = [...customers];

        if (search.trim()) {
            const q = search.toLowerCase();

            result = result.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(q) ||
                    customer.phone.toLowerCase().includes(q)
            );
        }

        if (sortBy === "NAME_ASC") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortBy === "NEWEST") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        return result;
    }, [customers, search, sortBy]);

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Customers</h2>
                <p className="text-sm text-gray-500">
                    Mijozlarni boshqarish sahifasi
                </p>
            </div>

            <CustomerForm
                onSaved={fetchCustomers}
                editingCustomer={editingCustomer}
                onCancelEdit={() => setEditingCustomer(null)}
            />

            <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-2">
                <input
                    type="text"
                    placeholder="Mijoz qidirish..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="NEWEST">Eng yangi</option>
                    <option value="NAME_ASC">Ismi bo‘yicha</option>
                </select>
            </div>

            {loading ? (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    Yuklanmoqda...
                </div>
            ) : (
                <CustomerTable
                    customers={filteredCustomers}
                    onDeleted={fetchCustomers}
                    onEdit={setEditingCustomer}
                />
            )}
        </section>
    );
}