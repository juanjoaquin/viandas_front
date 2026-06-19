"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import {
    TDailyProductionLine,
    UpsertDailyProductionLineInput,
    upsertDailyProductionLineInputSchema,
} from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

const dailyProductionIdSchema = z.uuid("El ID de la producción debe ser válido");

export async function upsertDailyProductionLineAction(
    dailyProductionId: string,
    data: UpsertDailyProductionLineInput,
    productionDate?: string,
): Promise<Result<TDailyProductionLine>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPSERT-DAILY-PRODUCTION-LINE] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsedId = dailyProductionIdSchema.safeParse(dailyProductionId.trim());
    if (!parsedId.success) {
        return Err(
            parsedId.error.issues[0]?.message ?? "ID de producción inválido",
            "VALIDATION",
        );
    }

    const parsed = upsertDailyProductionLineInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "upsert-daily-production-line",
        hasAccessToken: Boolean(accessToken),
        id: parsedId.data,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.upsertDailyProductionLine(
            parsedId.data,
            parsed.data,
        );

        if (!result.success) {
            Logger.error(
                "[ACTION][UPSERT-DAILY-PRODUCTION-LINE] Action returned error",
                { error: result.error, code: result.code },
            );
            return result;
        }

        updateTag("daily-productions");
        if (productionDate) updateTag(`daily-productions-${productionDate}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][UPSERT-DAILY-PRODUCTION-LINE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
