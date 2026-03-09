"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/auth-client";
import { AuthUser } from "@/types/user";

export function useMe() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, loading, refetchMe: fetchMe };
}