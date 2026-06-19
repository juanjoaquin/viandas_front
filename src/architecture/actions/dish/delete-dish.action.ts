"use server";

import { updateTag } from "next/cache";
import { deleteDishInputSchema } from "../../core/domain/entities/Dish";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DishRepository } from "../../infrastructure/repositories/dish/dish.repository";
import { DishController } from "../../controllers/dish.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function deleteDishAction(
    dishId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-DISH] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "delete-dish",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = deleteDishInputSchema.safeParse({ id: dishId.trim() });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de plato inválido",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DishRepository(httpClient);
        const controller = new DishController(repository);
        const result = await controller.deleteDish(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-DISH] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("dishes");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][DELETE-DISH] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
