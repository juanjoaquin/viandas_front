import { Err, Result } from "@/src/libs/result";
import {
    CreateDailyProductionPayload,
    TDailyProduction,
} from "../../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function createDailyProductionUseCase(
    repository: IDailyProductionRepository,
    data: CreateDailyProductionPayload,
): Promise<Result<TDailyProduction>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-DAILY-PRODUCTION] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-DAILY-PRODUCTION] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
