import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { getSessionFromCookie } from "@/lib/auth-server";

export default async function RegisterPage() {
  const session = await getSessionFromCookie();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <RegisterForm />
    </main>
  );
}