import { Err, Result } from "@/src/libs/result";
import {
    AddDailyProductionExtraInput,
    TDailyProductionExtra,
} from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function addDailyProductionExtraUseCase(
    repository: IDailyProductionRepository,
    dailyProductionId: string,
    data: AddDailyProductionExtraInput,
): Promise<Result<TDailyProductionExtra>> {
    try {
        const result = await repository.addExtra(dailyProductionId, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][ADD-DAILY-PRODUCTION-EXTRA] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][ADD-DAILY-PRODUCTION-EXTRA] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
