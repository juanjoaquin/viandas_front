"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DailyProductionController } from "../../controllers/daily-production.controller";
import {
    CreateDailyProductionFormInput,
    TDailyProduction,
    createDailyProductionFormParsedSchema,
} from "../../core/domain/entities/DailyProduction";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DailyProductionRepository } from "../../infrastructure/repositories/daily-production/daily-production.repository";

export async function createDailyProductionWithExtrasAction(
    data: CreateDailyProductionFormInput,
): Promise<Result<TDailyProduction>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-DAILY-PRODUCTION-WITH-EXTRAS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const parsed = createDailyProductionFormParsedSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    const { extras, ...createPayload } = parsed.data;

    setLogContext({
        operation: "create-daily-production-with-extras",
        hasAccessToken: Boolean(accessToken),
        date: createPayload.production_date,
        linesCount: createPayload.lines.length,
        extrasCount: extras.length,
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DailyProductionRepository(httpClient);
        const controller = new DailyProductionController(repository);

        const createResult = await controller.createDailyProduction(createPayload);
        if (!createResult.success) {
            Logger.error(
                "[ACTION][CREATE-DAILY-PRODUCTION-WITH-EXTRAS] Create returned error",
                { error: createResult.error, code: createResult.code },
            );
            return createResult;
        }

        const production = createResult.data;

        for (const extra of extras) {
            const extraResult = await controller.addDailyProductionExtra(
                production.id,
                extra,
            );

            if (!extraResult.success) {
                Logger.error(
                    "[ACTION][CREATE-DAILY-PRODUCTION-WITH-EXTRAS] Extra returned error",
                    { error: extraResult.error, code: extraResult.code },
                );
                updateTag("daily-productions");
                updateTag(`daily-productions-${createPayload.production_date}`);
                return Err(
                    `La producción se creó, pero falló al cargar un producto: ${extraResult.error}`,
                    "PARTIAL",
                );
            }
        }

        updateTag("daily-productions");
        updateTag(`daily-productions-${createPayload.production_date}`);

        return createResult;
    } catch (error) {
        Logger.error(
            "[ACTION][CREATE-DAILY-PRODUCTION-WITH-EXTRAS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
