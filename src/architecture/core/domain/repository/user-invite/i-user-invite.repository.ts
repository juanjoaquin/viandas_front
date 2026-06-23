import type { Result } from "@/src/libs/result";
import type {
  CreateUserInviteInput,
  TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";

export interface IUserInviteRepository {
  create(input: CreateUserInviteInput): Promise<Result<TUserInvite>>;
}
