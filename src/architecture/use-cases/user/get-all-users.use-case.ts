import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { TUser } from "../../core/domain/entities/User";
import {
    GetUsersFilters,
    normalizeGetUsersFilters,
} from "../../core/domain/user/get-users-filters";
import { IUserRepository } from "../../core/domain/repository/user/i-user.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllUsersUseCase(
    repository: IUserRepository,
    filters?: GetUsersFilters,
): Promise<Result<Paginated<TUser>>> {
    try {
        const result = await repository.getAll(normalizeGetUsersFilters(filters));

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-USERS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-USERS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
