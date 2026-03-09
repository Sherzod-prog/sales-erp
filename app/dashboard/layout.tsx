import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { getSessionFromCookie } from "@/lib/auth-server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSessionFromCookie();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}