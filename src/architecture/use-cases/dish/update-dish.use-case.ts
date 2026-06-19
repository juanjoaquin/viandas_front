import { UpdateDishInput } from "../../core/domain/entities/Dish";
import { IDishRepository } from "../../core/domain/repository/dish/i-dish.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateDishUseCase(
    repository: IDishRepository,
    id: string,
    data: UpdateDishInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-DISH] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][UPDATE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
