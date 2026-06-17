"use server";

import { cookies } from "next/headers";
import type { Result } from "@/src/libs/result";
import { Err } from "@/src/libs/result";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { createHttpClient } from "@/src/architecture/infrastructure/http/api-config";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

async function fetchMe(token: string | null): Promise<Result<TUser>> {
  const httpClient = createHttpClient(() => token);
  const repository = new AuthRepository(httpClient);
  const controller = new AuthController(repository);
  return controller.getMe();
}

export async function getMeAction(): Promise<Result<TUser>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;

    if (!accessToken) {
      return Err("Sesión expirada", "UNAUTHORIZED");
    }

    const result = await fetchMe(accessToken);

    if (!result.success) {
      Logger.error(
        "[ACTION][GET-ME] Action returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[ACTION][GET-ME] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
