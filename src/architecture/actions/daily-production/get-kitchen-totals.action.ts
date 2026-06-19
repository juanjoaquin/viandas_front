"use server";

import { z } from "zod";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import { TKitchenTotals } from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

const kitchenTotalsDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD");

export async function getKitchenTotalsAction(
    date: string,
): Promise<Result<TKitchenTotals>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-KITCHEN-TOTALS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = kitchenTotalsDateSchema.safeParse(date);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Fecha inválida",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "get-kitchen-totals",
        hasAccessToken: Boolean(accessToken),
        date: parsed.data,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.getKitchenTotals(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-KITCHEN-TOTALS] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-KITCHEN-TOTALS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
