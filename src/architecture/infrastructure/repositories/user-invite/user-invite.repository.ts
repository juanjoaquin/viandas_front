import type { IHttpClient } from "@/src/architecture/infrastructure/http/types";
import type { IUserInviteRepository } from "@/src/architecture/core/domain/repository/user-invite/i-user-invite.repository";
import type {
  CreateUserInviteInput,
  TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";
import type { Result } from "@/src/libs/result";

export class UserInviteRepository implements IUserInviteRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async create(input: CreateUserInviteInput): Promise<Result<TUserInvite>> {
    return await this.httpClient.post<TUserInvite>("/users/invites", input);
  }
}
