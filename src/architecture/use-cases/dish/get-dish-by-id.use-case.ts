import { TDish } from "../../core/domain/entities/Dish";
import { IDishRepository } from "../../core/domain/repository/dish/i-dish.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function getDishByIdUseCase(
    repository: IDishRepository,
    id: string,
): Promise<Result<TDish>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-DISH-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][GET-DISH-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
