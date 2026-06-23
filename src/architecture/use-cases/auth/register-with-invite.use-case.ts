import { Err, type Result } from "@/src/libs/result";
import type { RegisterWithInviteInput } from "@/src/architecture/core/domain/entities/Auth";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function registerWithInviteUseCase(
  repository: IAuthRepository,
  input: RegisterWithInviteInput,
): Promise<Result<null>> {
  try {
    const result = await repository.registerWithInvite(input);

    if (!result.success) {
      Logger.error(
        "[USE-CASE][REGISTER-WITH-INVITE] Use case returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[USE-CASE][REGISTER-WITH-INVITE] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
