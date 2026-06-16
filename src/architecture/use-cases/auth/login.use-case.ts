import { Err, type Result } from "@/src/libs/result";
import type { AuthTokens, LoginInput } from "@/src/architecture/core/domain/entities/Auth";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function loginUseCase(
  repository: IAuthRepository,
  input: LoginInput,
): Promise<Result<AuthTokens>> {
  try {
    const result = await repository.login(input);

    if (!result.success) {
      Logger.error(
        "[USE-CASE][LOGIN] Use case returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[USE-CASE][LOGIN] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
