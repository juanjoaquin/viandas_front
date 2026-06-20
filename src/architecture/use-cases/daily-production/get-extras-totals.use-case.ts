import { Err, Result } from "@/src/libs/result";
import { TExtrasTotals } from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getExtrasTotalsUseCase(
    repository: IDailyProductionRepository,
    date: string,
): Promise<Result<TExtrasTotals>> {
    try {
        const result = await repository.getExtrasTotals(date);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-EXTRAS-TOTALS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-EXTRAS-TOTALS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
