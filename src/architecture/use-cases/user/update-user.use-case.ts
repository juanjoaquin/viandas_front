import { UpdateUserInput } from "../../core/domain/entities/User";
import { IUserRepository } from "../../core/domain/repository/user/i-user.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateUserUseCase(
    repository: IUserRepository,
    id: string,
    data: UpdateUserInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-USER] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-USER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
