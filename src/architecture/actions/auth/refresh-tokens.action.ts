"use server";

import { cookies } from "next/headers";
import { API_CONFIG } from "@/src/architecture/infrastructure/http/api-config";
import type { AuthTokens } from "@/src/architecture/core/domain/entities/Auth";
import type { BackendResponse } from "@/src/architecture/infrastructure/http/types";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

const ACCESS_TOKEN_MAX_AGE = 60; // 1 minuto (debug)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * Intenta refrescar el accessToken usando el refreshToken de la cookie.
 * Si tiene éxito, actualiza ambas cookies y devuelve el nuevo accessToken.
 * Si falla, borra las cookies y devuelve null.
 */
export async function refreshTokensAction(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      Logger.warn("[ACTION][REFRESH] Refresh token inválido o expirado");
      return null;
    }

    const json = (await response.json()) as BackendResponse<AuthTokens>;
    const { accessToken, refreshToken: newRefreshToken } = json.data;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    cookieStore.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return accessToken;
  } catch (error) {
    Logger.error("[ACTION][REFRESH] Error de red al refrescar token", error);
    return null;
  }
}
