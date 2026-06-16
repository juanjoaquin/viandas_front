import { getHttpClient } from "@/src/architecture/infrastructure/http/api-config";
import type { IHttpClient } from "@/src/architecture/infrastructure/http/types";
import type { IAuthRepository } from "@/src/architecture/core/domain/repository/auth/i-auth.repository";
import type { AuthTokens, LoginInput } from "@/src/architecture/core/domain/entities/Auth";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import type { Result } from "@/src/libs/result";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: IHttpClient = getHttpClient()) {}

  async login(input: LoginInput): Promise<Result<AuthTokens>> {
    return await this.httpClient.post<AuthTokens>("/auth/login", input, {
      tags: ["auth"],
    });
  }

  async getMe(): Promise<Result<TUser>> {
    return await this.httpClient.get<TUser>("/auth/me", {
      tags: ["auth-me"],
    });
  }
}
