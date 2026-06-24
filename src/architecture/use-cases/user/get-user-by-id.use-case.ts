import { Err, Result } from "@/src/libs/result";
import { TUser } from "../../core/domain/entities/User";
import { IUserRepository } from "../../core/domain/repository/user/i-user.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getUserByIdUseCase(
    id: string,
    repository: IUserRepository,
): Promise<Result<TUser>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-USER-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-USER-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
