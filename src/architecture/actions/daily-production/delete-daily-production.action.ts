"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import { deleteDailyProductionInputSchema } from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

export async function deleteDailyProductionAction(
    dailyProductionId: string,
    productionDate?: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-DAILY-PRODUCTION] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = deleteDailyProductionInputSchema.safeParse({
        id: dailyProductionId.trim(),
    });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de producción inválido",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "delete-daily-production",
        hasAccessToken: Boolean(accessToken),
        id: parsed.data.id,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.deleteDailyProduction(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-DAILY-PRODUCTION] Action returned error",
                { error: result.error, code: result.code },
            );
            return result;
        }

        updateTag("daily-productions");
        if (productionDate) updateTag(`daily-productions-${productionDate}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][DELETE-DAILY-PRODUCTION] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
