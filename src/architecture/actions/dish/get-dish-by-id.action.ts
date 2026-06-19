"use server";

import { TDish } from "../../core/domain/entities/Dish";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DishRepository } from "../../infrastructure/repositories/dish/dish.repository";
import { DishController } from "../../controllers/dish.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function getDishByIdAction(dishId: string): Promise<Result<TDish>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-DISH-BY-ID] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = dishId.trim();
    if (!id) {
        return Err("ID de plato requerido", "VALIDATION");
    }

    setLogContext({
        operation: "get-dish-by-id",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DishRepository(httpClient);
        const controller = new DishController(repository);
        const result = await controller.getDishById(id);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-DISH-BY-ID] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][GET-DISH-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
