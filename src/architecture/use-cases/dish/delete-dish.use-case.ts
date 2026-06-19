import { IDishRepository } from "../../core/domain/repository/dish/i-dish.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteDishUseCase(
    repository: IDishRepository,
    id: string,
): Promise<Result<void>> {
    try {
        const result = await repository.delete(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-DISH] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][DELETE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
