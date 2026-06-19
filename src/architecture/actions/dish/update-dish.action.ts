"use server";

import { updateTag } from "next/cache";
import { updateDishInputSchema, UpdateDishInput } from "../../core/domain/entities/Dish";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DishRepository } from "../../infrastructure/repositories/dish/dish.repository";
import { DishController } from "../../controllers/dish.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function updateDishAction(
    dishId: string,
    data: UpdateDishInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-DISH] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = dishId.trim();
    if (!id) {
        return Err("ID de plato requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-dish",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateDishInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DishRepository(httpClient);
        const controller = new DishController(repository);
        const result = await controller.updateDish(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-DISH] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("dishes");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][UPDATE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
