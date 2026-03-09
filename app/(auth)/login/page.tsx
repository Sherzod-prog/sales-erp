import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getSessionFromCookie } from "@/lib/auth-server";

export default async function LoginPage() {
  const session = await getSessionFromCookie();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </main>
  );
}