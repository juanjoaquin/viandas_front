import { Err, Result } from "@/src/libs/result";
import {
    TDailyProduction,
    TDailyProductionFilters,
} from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getDailyProductionsByDateUseCase(
    repository: IDailyProductionRepository,
    date: string,
    filters?: TDailyProductionFilters,
): Promise<Result<TDailyProduction[]>> {
    try {
        const result = await repository.getByDate(date, filters);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-DAILY-PRODUCTIONS-BY-DATE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-DAILY-PRODUCTIONS-BY-DATE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
