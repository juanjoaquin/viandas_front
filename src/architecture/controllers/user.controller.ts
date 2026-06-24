import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { IUserRepository } from "../core/domain/repository/user/i-user.repository";
import { GetUsersFilters } from "../core/domain/user/get-users-filters";
import { TUser, UpdateUserInput } from "../core/domain/entities/User";
import { getAllUsersUseCase } from "../use-cases/user/get-all-users.use-case";
import { Logger } from "../infrastructure/logger/logger";
import { getUserByIdUseCase } from "../use-cases/user/get-user-by-id.use-case";
import { updateUserUseCase } from "../use-cases/user/update-user.use-case";

export class UserController {
    constructor(private readonly repository: IUserRepository) {}

    async getAllUsers(
        filters?: GetUsersFilters,
    ): Promise<Result<Paginated<TUser>>> {
        try {
            const result = await getAllUsersUseCase(this.repository, filters);

            if (!result.success) {
                Logger.error(
                    "[USER-CONTROLLER][GET-ALL-USERS] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[USER-CONTROLLER][GET-ALL-USERS] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getUserById(id: string): Promise<Result<TUser>> {
        try {
            const result = await getUserByIdUseCase(id, this.repository);

            if (!result.success) {
                Logger.error(
                    "[USER-CONTROLLER][GET-USER-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[USER-CONTROLLER][GET-USER-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateUser(
        id: string,
        data: UpdateUserInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateUserUseCase(this.repository, id, data);

            if (!result.success) {
                Logger.error(
                    "[USER-CONTROLLER][UPDATE-USER] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[USER-CONTROLLER][UPDATE-USER] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
