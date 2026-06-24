import { getHttpClient } from "@/src/architecture/infrastructure/http/api-config";
import type { IHttpClient } from "@/src/architecture/infrastructure/http/types";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import type {
  AuthTokens,
  ForgotPasswordInput,
  LoginInput,
  LogoutInput,
  RegisterWithInviteInput,
  ResetPasswordInput,
} from "@/src/architecture/core/domain/entities/Auth";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import type { Result } from "@/src/libs/result";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: IHttpClient = getHttpClient()) {}

  async login(input: LoginInput): Promise<Result<AuthTokens>> {
    return await this.httpClient.post<AuthTokens>("/auth/login", input, {
      tags: ["auth"],
    });
  }

  async registerWithInvite(
    input: RegisterWithInviteInput,
  ): Promise<Result<null>> {
    return await this.httpClient.post<null>("/auth/register-with-invite", input, {
      allowNull: true,
      tags: ["auth-register-with-invite"],
    });
  }

  async getMe(): Promise<Result<TUser>> {
    return await this.httpClient.get<TUser>("/auth/me", {
      tags: ["auth-me"],
    });
  }

  async logout(input: LogoutInput): Promise<Result<null>> {
    return await this.httpClient.post<null>(
      "/auth/logout",
      { refresh_token: input.refreshToken },
      { allowNull: true, tags: ["auth-logout"] },
    );
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<Result<null>> {
    return await this.httpClient.post<null>("/auth/forgot-password", input, {
      allowNull: true,
      tags: ["auth-forgot-password"],
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<Result<null>> {
    return await this.httpClient.post<null>("/auth/reset-password", input, {
      allowNull: true,
      tags: ["auth-reset-password"],
    });
  }
}
