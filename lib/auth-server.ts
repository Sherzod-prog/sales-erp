import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type SessionPayload = {
  userId: string;
  email: string;
  role: "ADMIN" | "MANAGER";
};

export async function getSessionFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: Array<"ADMIN" | "MANAGER">) {
  const session = await requireAuth();

  if (!roles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}

export function hasRole(
  role: "ADMIN" | "MANAGER" | undefined,
  allowedRoles: Array<"ADMIN" | "MANAGER">
) {
  if (!role) return false;
  return allowedRoles.includes(role);
}