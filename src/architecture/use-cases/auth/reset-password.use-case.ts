import { Err, type Result } from "@/src/libs/result";
import type { ResetPasswordInput } from "@/src/architecture/core/domain/entities/Auth";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function resetPasswordUseCase(
  repository: IAuthRepository,
  input: ResetPasswordInput,
): Promise<Result<null>> {
  try {
    const result = await repository.resetPassword(input);

    if (!result.success) {
      Logger.error(
        "[USE-CASE][RESET-PASSWORD] Use case returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[USE-CASE][RESET-PASSWORD] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
