export async function loginRequest(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login xatoligi");
  }

  return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Register xatoligi");
  }

  return data;
}

export async function logoutRequest() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Logout xatoligi");
  }

  return data;
}

export async function getMe() {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Userni olishda xatolik");
  }

  return data;
}