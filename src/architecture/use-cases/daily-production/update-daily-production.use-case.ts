import { Err, Result } from "@/src/libs/result";
import { UpdateDailyProductionPayload } from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateDailyProductionUseCase(
    repository: IDailyProductionRepository,
    data: UpdateDailyProductionPayload,
): Promise<Result<void>> {
    try {
        const result = await repository.update(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-DAILY-PRODUCTION] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-DAILY-PRODUCTION] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
