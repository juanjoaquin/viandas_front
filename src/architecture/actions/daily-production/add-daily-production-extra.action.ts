"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import {
    AddDailyProductionExtraInput,
    TDailyProductionExtra,
    addDailyProductionExtraInputSchema,
} from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

const dailyProductionIdSchema = z.uuid("El ID de la producción debe ser válido");

export async function addDailyProductionExtraAction(
    dailyProductionId: string,
    data: AddDailyProductionExtraInput,
    productionDate?: string,
): Promise<Result<TDailyProductionExtra>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][ADD-DAILY-PRODUCTION-EXTRA] Unauthorized — no access token",
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

    const parsed = addDailyProductionExtraInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "add-daily-production-extra",
        hasAccessToken: Boolean(accessToken),
        id: parsedId.data,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.addDailyProductionExtra(
            parsedId.data,
            parsed.data,
        );

        if (!result.success) {
            Logger.error(
                "[ACTION][ADD-DAILY-PRODUCTION-EXTRA] Action returned error",
                { error: result.error, code: result.code },
            );
            return result;
        }

        updateTag("daily-productions");
        if (productionDate) updateTag(`daily-productions-${productionDate}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][ADD-DAILY-PRODUCTION-EXTRA] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
