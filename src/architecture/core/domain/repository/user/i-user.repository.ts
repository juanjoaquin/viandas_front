import { Result } from "@/src/libs/result";
import { Paginated } from "../../pagination";
import { TUser, UpdateUserInput } from "../../entities/User";
import { GetUsersFilters } from "../../user/get-users-filters";

export interface IUserRepository {
    getAll(filters?: GetUsersFilters): Promise<Result<Paginated<TUser>>>;
    getById(id: string): Promise<Result<TUser>>;
    update(id: string, data: UpdateUserInput): Promise<Result<void>>;
}
