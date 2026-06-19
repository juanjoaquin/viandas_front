"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { DishRepository } from "../../infrastructure/repositories/dish/dish.repository";
import { DishController } from "../../controllers/dish.controller";
import { CreateDishInput, TDish, createDishInputSchema } from "../../core/domain/entities/Dish";

export async function createDishAction(
    data: CreateDishInput,
): Promise<Result<TDish>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-DISH] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "create-dish", hasAccessToken: Boolean(accessToken) });

    const parsed = createDishInputSchema.safeParse(data);
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
        const result = await controller.createDish(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-DISH] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("dishes");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][CREATE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
