"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Renovar 10s antes del maxAge (15 min en login/refresh actions)
const REFRESH_INTERVAL_MS = (15 * 60 - 10) * 1000;

export function TokenRefresher() {
  const router = useRouter();

  useEffect(() => {
    async function refreshTokens() {
      const response = await fetch("/api/refresh/silent", {
        credentials: "include",
      });

      if (response.status === 401) {
        router.replace("/login");
      }
    }

    const intervalId = setInterval(refreshTokens, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}
