"use client";

import { ReactNode } from "react";
import { useMe } from "@/hooks/useMe";

type Role = "ADMIN" | "MANAGER";

type RoleGateProps = {
    allowedRoles: Role[];
    children: ReactNode;
    fallback?: ReactNode;
};

export default function RoleGate({
    allowedRoles,
    children,
    fallback = null,
}: RoleGateProps) {
    const { user, loading } = useMe();

    if (loading) {
        return null;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}