import { Err, Result } from "@/src/libs/result";
import {
    TDailyProductionLine,
    UpsertDailyProductionLineInput,
} from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function upsertDailyProductionLineUseCase(
    repository: IDailyProductionRepository,
    dailyProductionId: string,
    data: UpsertDailyProductionLineInput,
): Promise<Result<TDailyProductionLine>> {
    try {
        const result = await repository.upsertLine(dailyProductionId, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPSERT-DAILY-PRODUCTION-LINE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPSERT-DAILY-PRODUCTION-LINE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
