import type { Result } from "@/src/libs/result";
import type {
  AuthTokens,
  LoginInput,
  LogoutInput,
  RegisterWithInviteInput,
} from "@/src/architecture/core/domain/entities/Auth";
import type { TUser } from "@/src/architecture/core/domain/entities/User";

export interface IAuthRepository {
  login(input: LoginInput): Promise<Result<AuthTokens>>;
  registerWithInvite(input: RegisterWithInviteInput): Promise<Result<null>>;
  getMe(): Promise<Result<TUser>>;
  logout(input: LogoutInput): Promise<Result<null>>;
}
