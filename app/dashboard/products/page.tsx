"use client";

import { useEffect, useMemo, useState } from "react";
import ProductForm from "@/components/products/ProductForm";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";
import { useMe } from "@/hooks/useMe";

type StockFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
type SortOption = "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC";

export default function ProductsPage() {
    const { user, loading: userLoading } = useMe();
    const isAdmin = user?.role === "ADMIN";


    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
    const [sortBy, setSortBy] = useState<SortOption>("NEWEST");

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/products", {
                cache: "no-store",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Mahsulotlarni olishda xatolik");
            }

            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(q) ||
                    (product.description || "").toLowerCase().includes(q)
            );
        }

        if (stockFilter === "IN_STOCK") {
            result = result.filter((product) => product.stock > 0);
        }

        if (stockFilter === "LOW_STOCK") {
            result = result.filter((product) => product.stock > 0 && product.stock <= 5);
        }

        if (stockFilter === "OUT_OF_STOCK") {
            result = result.filter((product) => product.stock === 0);
        }

        if (sortBy === "PRICE_ASC") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sortBy === "PRICE_DESC") {
            result.sort((a, b) => b.price - a.price);
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
    }, [products, search, stockFilter, sortBy]);

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Products</h2>
                <p className="text-sm text-gray-500">
                    Mahsulotlarni boshqarish sahifasi
                </p>
            </div>
            {isAdmin ? (
                <ProductForm
                    onSaved={fetchProducts}
                    editingProduct={editingProduct}
                    onCancelEdit={() => setEditingProduct(null)}
                />

            ) :
                (
                    <div className="rounded-2xl border bg-white p-4 text-sm text-gray-500 shadow-sm">
                        Siz mahsulot qo‘sha olmaysiz. Faqat ADMIN ruxsatiga ega.
                    </div>
                )}

            <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-3">
                <input
                    type="text"
                    placeholder="Mahsulot qidirish..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                />

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as StockFilter)}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="ALL">Barcha stocklar</option>
                    <option value="IN_STOCK">Stock bor</option>
                    <option value="LOW_STOCK">Kam qolgan</option>
                    <option value="OUT_OF_STOCK">Tugagan</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="NEWEST">Eng yangi</option>
                    <option value="PRICE_ASC">Narx: o‘sish</option>
                    <option value="PRICE_DESC">Narx: kamayish</option>
                    <option value="NAME_ASC">Nomi bo‘yicha</option>
                </select>
            </div>

            {loading ? (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    Yuklanmoqda...
                </div>
            ) : (
                <ProductTable
                    products={filteredProducts}
                    onDeleted={fetchProducts}
                    onEdit={setEditingProduct}
                    canManage={isAdmin} />
            )}
        </section>
    );
}