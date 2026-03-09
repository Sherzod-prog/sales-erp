"use client";

import { useRouter } from "next/navigation";
import { logoutRequest } from "@/lib/auth-client";
import { useMe } from "@/hooks/useMe";

export default function Header() {
    const router = useRouter();
    const { user, loading } = useMe();

    const handleLogout = async () => {
        try {
            await logoutRequest();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
                <h1 className="text-xl font-semibold">Sales ERP</h1>
                <p className="text-sm text-gray-500">Savdo boshqaruv paneli</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    {loading ? (
                        <p className="text-sm text-gray-400">Yuklanmoqda...</p>
                    ) : user ? (
                        <>
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">
                                {user.email} · {user.role}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400">User topilmadi</p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}