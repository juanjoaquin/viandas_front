"use server";

import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DishController } from "../../controllers/dish.controller";
import { GetDishesFilters } from "../../core/domain/dish/get-dishes-filters";
import { TDish } from "../../core/domain/entities/Dish";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DishRepository } from "../../infrastructure/repositories/dish/dish.repository";

export async function getAllDishesAction(
    filters?: GetDishesFilters,
): Promise<Result<Paginated<TDish>>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-DISHES] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "get-all-dishes",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DishRepository(httpClient);
        const controller = new DishController(repository);
        const result = await controller.getAllDishes(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-DISHES] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-ALL-DISHES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
