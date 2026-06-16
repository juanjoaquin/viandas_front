"use server";

import { cookies } from "next/headers";
import type { Result } from "@/src/libs/result";
import { Err } from "@/src/libs/result";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { createHttpClient } from "@/src/architecture/infrastructure/http/api-config";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function getMeAction(): Promise<Result<TUser>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;

    const httpClient = createHttpClient(() => accessToken);
    const repository = new AuthRepository(httpClient);
    const controller = new AuthController(repository);

    const result = await controller.getMe();

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
