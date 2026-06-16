import { Err, type Result } from "@/src/libs/result";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function getMeUseCase(
  repository: IAuthRepository,
): Promise<Result<TUser>> {
  try {
    const result = await repository.getMe();

    if (!result.success) {
      Logger.error(
        "[USE-CASE][GET-ME] Use case returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[USE-CASE][GET-ME] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
