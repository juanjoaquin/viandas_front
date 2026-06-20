import { Err, Result } from "@/src/libs/result";
import {
    TDailyProductionExtra,
    UpdateDailyProductionExtraInput,
} from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateDailyProductionExtraUseCase(
    repository: IDailyProductionRepository,
    dailyProductionId: string,
    extraId: string,
    data: UpdateDailyProductionExtraInput,
): Promise<Result<TDailyProductionExtra>> {
    try {
        const result = await repository.updateExtra(dailyProductionId, extraId, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-DAILY-PRODUCTION-EXTRA] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-DAILY-PRODUCTION-EXTRA] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
