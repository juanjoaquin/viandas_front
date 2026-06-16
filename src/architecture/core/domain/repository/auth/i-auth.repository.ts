import type { Result } from "@/src/libs/result";
import type { AuthTokens, LoginInput } from "@/src/architecture/core/domain/entities/Auth";
import type { TUser } from "@/src/architecture/core/domain/entities/User";

export interface IAuthRepository {
  login(input: LoginInput): Promise<Result<AuthTokens>>;
  getMe(): Promise<Result<TUser>>;
}
