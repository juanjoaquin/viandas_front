import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { TDish } from "../../core/domain/entities/Dish";
import {
    GetDishesFilters,
    normalizeGetDishesFilters,
} from "../../core/domain/dish/get-dishes-filters";
import { IDishRepository } from "../../core/domain/repository/dish/i-dish.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllDishesUseCase(
    repository: IDishRepository,
    filters?: GetDishesFilters,
): Promise<Result<Paginated<TDish>>> {
    try {
        const result = await repository.getAll(
            normalizeGetDishesFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-DISHES] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-DISHES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
