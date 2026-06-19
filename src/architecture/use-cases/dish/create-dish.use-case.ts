import { Err, Result } from "@/src/libs/result";
import { IDishRepository } from "../../core/domain/repository/dish/i-dish.repository";
import { CreateDishInput, TDish } from "../../core/domain/entities/Dish";
import { Logger } from "../../infrastructure/logger/logger";

export async function createDishUseCase(
    repository: IDishRepository,
    data: CreateDishInput,
): Promise<Result<TDish>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-DISH] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
