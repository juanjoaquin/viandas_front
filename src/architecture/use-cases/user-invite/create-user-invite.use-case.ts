import { Err, type Result } from "@/src/libs/result";
import type {
  CreateUserInviteInput,
  TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";
import type { IUserInviteRepository } from "@/src/architecture/core/domain/repository/user-invite/i-user-invite.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";

export async function createUserInviteUseCase(
  repository: IUserInviteRepository,
  input: CreateUserInviteInput,
): Promise<Result<TUserInvite>> {
  try {
    const result = await repository.create(input);

    if (!result.success) {
      Logger.error(
        "[USE-CASE][CREATE-USER-INVITE] Use case returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[USE-CASE][CREATE-USER-INVITE] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
