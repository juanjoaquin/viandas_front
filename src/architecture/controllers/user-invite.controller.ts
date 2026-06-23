import { Err, type Result } from "@/src/libs/result";
import type {
  CreateUserInviteInput,
  TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";
import type { IUserInviteRepository } from "@/src/architecture/core/domain/repository/user-invite/i-user-invite.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";
import { createUserInviteUseCase } from "@/src/architecture/use-cases/user-invite/create-user-invite.use-case";

export class UserInviteController {
  constructor(private readonly repository: IUserInviteRepository) {}

  async createInvite(
    input: CreateUserInviteInput,
  ): Promise<Result<TUserInvite>> {
    try {
      const result = await createUserInviteUseCase(this.repository, input);

      if (!result.success) {
        Logger.error(
          "[USER-INVITE-CONTROLLER][CREATE-INVITE] Controller returned error",
          { error: result.error, code: result.code },
        );
      }

      return result;
    } catch (error) {
      Logger.error(
        "[USER-INVITE-CONTROLLER][CREATE-INVITE] Unexpected error",
        error,
      );

      return Err(
        error instanceof Error ? error.message : "Error desconocido",
        "UNKNOWN",
      );
    }
  }
}
