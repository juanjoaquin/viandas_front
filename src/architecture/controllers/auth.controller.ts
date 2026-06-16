import { Err, type Result } from "@/src/libs/result";
import type { AuthTokens, LoginInput } from "@/src/architecture/core/domain/entities/Auth";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import { Logger } from "@/src/architecture/infrastructure/logger/logger";
import { loginUseCase } from "@/src/architecture/use-cases/auth/login.use-case";
import { getMeUseCase } from "@/src/architecture/use-cases/auth/getMe.use-case";

export class AuthController {

  constructor(private readonly repository: IAuthRepository) {}

  async login(input: LoginInput): Promise<Result<AuthTokens>> {
    try {
      const result = await loginUseCase(this.repository, input);

      if (!result.success) {
        Logger.error(
          "[AUTH-CONTROLLER][LOGIN] Controller returned error",
          { error: result.error, code: result.code },
        );
      }

      return result;
    } catch (error) {
      Logger.error(
        "[AUTH-CONTROLLER][LOGIN] Unexpected error",
        error,
      );

      return Err(
        error instanceof Error ? error.message : "Error desconocido",
        "UNKNOWN",
      );
    }
  }

  async getMe(): Promise<Result<TUser>> {
    try {
      const result = await getMeUseCase(this.repository);

      if (!result.success) {
        Logger.error(
          "[AUTH-CONTROLLER][GET-ME] Controller returned error",
          { error: result.error, code: result.code },
        );
      }

      return result;
    } catch (error) {
      Logger.error(
        "[AUTH-CONTROLLER][GET-ME] Unexpected error",
        error,
      );

      return Err(
        error instanceof Error ? error.message : "Error desconocido",
        "UNKNOWN",
      );
    }
  }
}
