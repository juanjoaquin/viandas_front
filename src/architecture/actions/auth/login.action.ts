"use server";

import { cookies } from "next/headers";
import type { Result } from "@/src/libs/result";
import { Err } from "@/src/libs/result";
import {
  loginInputSchema,
  type AuthTokens,
  type LoginInput,
} from "@/src/architecture/core/domain/entities/Auth";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

const ACCESS_TOKEN_MAX_AGE = 60; // 1 minuto (debug)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 días

export async function loginAction(input: LoginInput): Promise<Result<AuthTokens>> {
  const parsed = loginInputSchema.safeParse(input);
  if (!parsed.success) {
    return Err(parsed.error.issues[0]?.message ?? "Datos inválidos", "VALIDATION");
  }

  try {
    const repository = new AuthRepository();
    const controller = new AuthController(repository);
    const result = await controller.login(parsed.data);

    if (!result.success) {
      Logger.error(
        "[ACTION][LOGIN] Action returned error",
        { error: result.error, code: result.code },
      );
      return result;
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/",
    });

    return result;
  } catch (error) {
    Logger.error(
      "[ACTION][LOGIN] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
