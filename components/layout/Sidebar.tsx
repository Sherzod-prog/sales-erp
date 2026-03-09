"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMe } from "@/hooks/useMe";

type LinkItem = {
    href: string;
    label: string;
    roles: Array<"ADMIN" | "MANAGER">;
};

const links: LinkItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        roles: ["ADMIN", "MANAGER"],
    },
    {
        href: "/dashboard/products",
        label: "Products",
        roles: ["ADMIN", "MANAGER"],
    },
    {
        href: "/dashboard/customers",
        label: "Customers",
        roles: ["ADMIN", "MANAGER"],
    },
    {
        href: "/dashboard/orders",
        label: "Orders",
        roles: ["ADMIN", "MANAGER"],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, loading } = useMe();

    const filteredLinks = links.filter((link) =>
        user ? link.roles.includes(user.role) : false
    );

    return (
        <aside className="min-h-screen w-64 border-r bg-white p-4">
            <h2 className="mb-6 text-2xl font-bold">Mini ERP</h2>

            {loading ? (
                <p className="text-sm text-gray-400">Yuklanmoqda...</p>
            ) : (
                <nav className="space-y-2">
                    {filteredLinks.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block rounded-lg px-4 py-2 transition ${active
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </aside>
    );
}