import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { IDishRepository } from "../core/domain/repository/dish/i-dish.repository";
import { CreateDishInput, TDish, UpdateDishInput } from "../core/domain/entities/Dish";
import { GetDishesFilters } from "../core/domain/dish/get-dishes-filters";
import { getAllDishesUseCase } from "../use-cases/dish/get-all-dishes.use-case";
import { createDishUseCase } from "../use-cases/dish/create-dish.use-case";
import { getDishByIdUseCase } from "../use-cases/dish/get-dish-by-id.use-case";
import { updateDishUseCase } from "../use-cases/dish/update-dish.use-case";
import { deleteDishUseCase } from "../use-cases/dish/delete-dish.use-case";
import { Logger } from "../infrastructure/logger/logger";

export class DishController {
    constructor(private readonly repository: IDishRepository) {}

    async getAllDishes(
        filters?: GetDishesFilters,
    ): Promise<Result<Paginated<TDish>>> {
        try {
            const result = await getAllDishesUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[DISH-CONTROLLER][GET-ALL-DISHES] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DISH-CONTROLLER][GET-ALL-DISHES] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createDish(data: CreateDishInput): Promise<Result<TDish>> {
        try {
            const result = await createDishUseCase(this.repository, data);

            if (!result.success) {
                Logger.error(
                    "[DISH-CONTROLLER][CREATE-DISH] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DISH-CONTROLLER][CREATE-DISH] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getDishById(id: string): Promise<Result<TDish>> {
        try {
            const result = await getDishByIdUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[DISH-CONTROLLER][GET-DISH-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DISH-CONTROLLER][GET-DISH-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateDish(id: string, data: UpdateDishInput): Promise<Result<void>> {
        try {
            const result = await updateDishUseCase(this.repository, id, data);

            if (!result.success) {
                Logger.error(
                    "[DISH-CONTROLLER][UPDATE-DISH] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DISH-CONTROLLER][UPDATE-DISH] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteDish(id: string): Promise<Result<void>> {
        try {
            const result = await deleteDishUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[DISH-CONTROLLER][DELETE-DISH] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DISH-CONTROLLER][DELETE-DISH] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
