"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginRequest } from "@/lib/auth-client";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginRequest(email, password);
            router.push("/dashboard");
            router.refresh();
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
            <h1 className="mb-2 text-2xl font-bold">Login</h1>
            <p className="mb-6 text-sm text-gray-500">
                Tizimga kirish uchun ma’lumotlarni kiriting
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@gmail.com"
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
                    {loading ? "Kirilmoqda..." : "Kirish"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Akkount yo‘qmi?{" "}
                <Link href="/register" className="font-medium text-black underline">
                    Ro‘yxatdan o‘tish
                </Link>
            </p>
        </div>
    );
}