"use server";

import type { Result } from "@/src/libs/result";
import { Err } from "@/src/libs/result";
import {
  registerWithInviteInputSchema,
  type RegisterWithInviteInput,
} from "@/src/architecture/core/domain/entities/Auth";
import { AuthController } from "@/src/architecture/controllers/auth.controller";
import { AuthRepository } from "@/src/architecture/infrastructure/repositories/auth/auth.repository";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";

export async function registerWithInviteAction(
  input: RegisterWithInviteInput,
): Promise<Result<null>> {
  const parsed = registerWithInviteInputSchema.safeParse(input);
  if (!parsed.success) {
    return Err(parsed.error.issues[0]?.message ?? "Datos inválidos", "VALIDATION");
  }

  try {
    setLogContext({ operation: "register-with-invite", hasAccessToken: false });

    const repository = new AuthRepository();
    const controller = new AuthController(repository);
    const result = await controller.registerWithInvite(parsed.data);

    if (!result.success) {
      Logger.error(
        "[ACTION][REGISTER-WITH-INVITE] Action returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[ACTION][REGISTER-WITH-INVITE] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
