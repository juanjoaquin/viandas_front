import { IUserRepository } from "@/src/architecture/core/domain/repository/user/i-user.repository";
import { GetUsersFilters } from "@/src/architecture/core/domain/user/get-users-filters";
import { HttpClient } from "../../http";
import { TUser, UpdateUserInput } from "@/src/architecture/core/domain/entities/User";
import { appendPaginationParams, Paginated } from "@/src/architecture/core/domain/pagination";
import { Result } from "@/src/libs/result";

export class UserRepository implements IUserRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(filters?: GetUsersFilters): Promise<Result<Paginated<TUser>>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        if (filters?.active != null) params.set("active", String(filters.active));
        appendPaginationParams(params, filters);
        const qs = params.toString();
        const endpoint = qs ? `users?${qs}` : "users";

        return await this.httpClient.getPaginated<TUser>(endpoint, {
            tags: ["users"],
        });
    }

    async getById(id: string): Promise<Result<TUser>> {
        const params = new URLSearchParams({ userId: id });

        return await this.httpClient.get<TUser>(`users/one?${params.toString()}`, {
            tags: ["users", `user-${id}`],
        });
    }

    async update(id: string, data: UpdateUserInput): Promise<Result<void>> {
        return await this.httpClient.put<void>("users", {
            id,
            active: data.active,
        });
    }
}
