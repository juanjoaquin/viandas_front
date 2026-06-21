"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { OverviewController } from "../../controllers/overview.controller";
import {
    productionOverviewFiltersSchema,
    TProductionOverview,
    TProductionOverviewFilters,
} from "../../core/domain/entities/Overview";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { OverviewRepository } from "../../infrastructure/repositories/overview/overview.repository";

export async function getProductionOverviewAction(
    filters: TProductionOverviewFilters,
): Promise<Result<TProductionOverview>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-PRODUCTION-OVERVIEW] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = productionOverviewFiltersSchema.safeParse(filters);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Rango de fechas inválido",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "get-production-overview",
        hasAccessToken: Boolean(accessToken),
        from: parsed.data.from,
        to: parsed.data.to,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new OverviewRepository(httpClient);
        const controller = new OverviewController(repository);
        const result = await controller.getProductionOverview(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-PRODUCTION-OVERVIEW] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-PRODUCTION-OVERVIEW] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
