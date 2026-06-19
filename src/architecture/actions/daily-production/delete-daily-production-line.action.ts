"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

const dailyProductionIdSchema = z.uuid("El ID de la producción debe ser válido");
const lineIdSchema = z.uuid("El ID de la línea debe ser válido");

export async function deleteDailyProductionLineAction(
    dailyProductionId: string,
    lineId: string,
    productionDate?: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-DAILY-PRODUCTION-LINE] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsedProductionId = dailyProductionIdSchema.safeParse(
        dailyProductionId.trim(),
    );
    if (!parsedProductionId.success) {
        return Err(
            parsedProductionId.error.issues[0]?.message ??
                "ID de producción inválido",
            "VALIDATION",
        );
    }

    const parsedLineId = lineIdSchema.safeParse(lineId.trim());
    if (!parsedLineId.success) {
        return Err(
            parsedLineId.error.issues[0]?.message ?? "ID de línea inválido",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "delete-daily-production-line",
        hasAccessToken: Boolean(accessToken),
        id: parsedProductionId.data,
        lineId: parsedLineId.data,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.deleteDailyProductionLine(
            parsedProductionId.data,
            parsedLineId.data,
        );

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-DAILY-PRODUCTION-LINE] Action returned error",
                { error: result.error, code: result.code },
            );
            return result;
        }

        updateTag("daily-productions");
        if (productionDate) updateTag(`daily-productions-${productionDate}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][DELETE-DAILY-PRODUCTION-LINE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
