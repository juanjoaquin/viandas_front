"use server";

import { Err, type Result } from "@/src/libs/result";
import {
  forgotPasswordInputSchema,
  type ForgotPasswordInput,
} from "@/src/architecture/core/domain/entities/Auth";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";

export async function forgotPasswordAction(
  data: ForgotPasswordInput,
): Promise<Result<null>> {
  const parsed = forgotPasswordInputSchema.safeParse(data);
  if (!parsed.success) {
    return Err(parsed.error.issues[0]?.message ?? "Datos inválidos", "VALIDATION");
  }

  try {
    setLogContext({ operation: "forgot-password" });

    const repository = new AuthRepository();
    const controller = new AuthController(repository);
    const result = await controller.forgotPassword(parsed.data);

    if (!result.success) {
      Logger.error(
        "[ACTION][FORGOT-PASSWORD] Action returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[ACTION][FORGOT-PASSWORD] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
