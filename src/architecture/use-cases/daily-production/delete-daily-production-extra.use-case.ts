import { Err, Result } from "@/src/libs/result";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteDailyProductionExtraUseCase(
    repository: IDailyProductionRepository,
    dailyProductionId: string,
    extraId: string,
): Promise<Result<void>> {
    try {
        const result = await repository.deleteExtra(dailyProductionId, extraId);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-DAILY-PRODUCTION-EXTRA] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-DAILY-PRODUCTION-EXTRA] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
