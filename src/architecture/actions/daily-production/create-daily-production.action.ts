"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import {
    CreateDailyProductionInput,
    TDailyProduction,
    createDailyProductionInputSchema,
} from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

export async function createDailyProductionAction(
    data: CreateDailyProductionInput,
): Promise<Result<TDailyProduction>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-DAILY-PRODUCTION] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = createDailyProductionInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "create-daily-production",
        hasAccessToken: Boolean(accessToken),
        date: parsed.data.production_date,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.createDailyProduction(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-DAILY-PRODUCTION] Action returned error",
                { error: result.error, code: result.code },
            );
            return result;
        }

        updateTag("daily-productions");
        updateTag(`daily-productions-${parsed.data.production_date}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][CREATE-DAILY-PRODUCTION] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
