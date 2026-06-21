import { Err, Result } from "@/src/libs/result";
import {
    TProductionOverview,
    TProductionOverviewFilters,
} from "../../core/domain/entities/Overview";
import { IOverviewRepository } from "../../core/domain/repository/overview/i-overview.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getProductionOverviewUseCase(
    repository: IOverviewRepository,
    filters: TProductionOverviewFilters,
): Promise<Result<TProductionOverview>> {
    try {
        const result = await repository.getProductionOverview(filters);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-PRODUCTION-OVERVIEW] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-PRODUCTION-OVERVIEW] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
