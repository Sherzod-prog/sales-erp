"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRequest } from "@/lib/auth-client";

export default function RegisterForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerRequest(name, email, password);
            router.push("/login");
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
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold">Register</h1>
            <p className="mb-6 text-sm text-gray-500">
                Yangi foydalanuvchi yarating
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Ism</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ali"
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ali@gmail.com"
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Parol</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? "Yaratilmoqda..." : "Ro‘yxatdan o‘tish"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Akkount bormi?{" "}
                <Link href="/login" className="font-medium text-black underline">
                    Login
                </Link>
            </p>
        </div>
    );
}