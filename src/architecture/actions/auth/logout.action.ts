"use server";

import { cookies } from "next/headers";
import type { Result } from "@/src/libs/result";
import { Err, Success } from "@/src/libs/result";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";

export async function logoutAction(): Promise<Result<null>> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    setLogContext({
      operation: "logout",
      hasAccessToken: Boolean(cookieStore.get("accessToken")?.value),
      hasRefreshToken: Boolean(refreshToken),
    });

    if (refreshToken) {
      const repository = new AuthRepository();
      const controller = new AuthController(repository);
      const result = await controller.logout({ refreshToken });

      if (!result.success) {
        Logger.warn(
          "[ACTION][LOGOUT] Could not revoke refresh token on server",
          { error: result.error, code: result.code },
        );
      }
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return Success(null);
  } catch (error) {
    Logger.error(
      "[ACTION][LOGOUT] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
