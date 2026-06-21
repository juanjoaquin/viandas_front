"use server";

import { z } from "zod";
import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import {
    dailyProductionSortOptions,
    fulfillmentTypes,
    sortOrderOptions,
    TDailyProduction,
    TDailyProductionFilters,
} from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

const dailyProductionDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD");

const optionalTrimmedString = z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().optional(),
);

const optionalUuid = z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.uuid().optional(),
);

const dailyProductionFiltersSchema = z.object({
    q: optionalTrimmedString,
    fulfillment_type: z.enum(fulfillmentTypes).optional(),
    menu_type_id: optionalUuid,
    delivery_id: optionalUuid,
    sort: z.enum(dailyProductionSortOptions).optional(),
    order: z.enum(sortOrderOptions).optional(),
});

export async function getDailyProductionsByDateAction(
    date: string,
    filters?: TDailyProductionFilters,
): Promise<Result<Paginated<TDailyProduction>>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-DAILY-PRODUCTIONS-BY-DATE] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = dailyProductionDateSchema.safeParse(date);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Fecha inválida",
            "VALIDATION",
        );
    }

    const parsedFilters = dailyProductionFiltersSchema.safeParse(filters ?? {});
    if (!parsedFilters.success) {
        return Err(
            parsedFilters.error.issues[0]?.message ?? "Filtros inválidos",
            "VALIDATION",
        );
    }

    setLogContext({
        operation: "get-daily-productions-by-date",
        hasAccessToken: Boolean(accessToken),
        date: parsed.data,
        filters: parsedFilters.data,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);
        const result = await controller.getDailyProductionsByDate(
            parsed.data,
            parsedFilters.data,
        );

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-DAILY-PRODUCTIONS-BY-DATE] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-DAILY-PRODUCTIONS-BY-DATE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
