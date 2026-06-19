import { Err, Result } from "@/src/libs/result";
import { TKitchenTotals } from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getKitchenTotalsUseCase(
    repository: IDailyProductionRepository,
    date: string,
): Promise<Result<TKitchenTotals>> {
    try {
        const result = await repository.getKitchenTotals(date);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-KITCHEN-TOTALS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-KITCHEN-TOTALS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
