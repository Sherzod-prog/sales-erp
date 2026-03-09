import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/auth-server";

type Role = "ADMIN" | "MANAGER";

export async function authorize(allowedRoles: Role[]) {
  const session = await getSessionFromCookie();

  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(session.role)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true as const,
    session,
  };
}