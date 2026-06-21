import { Err, Result } from "@/src/libs/result";
import {
    TProductionOverview,
    TProductionOverviewFilters,
} from "../core/domain/entities/Overview";
import { IOverviewRepository } from "../core/domain/repository/overview/i-overview.repository";
import { Logger } from "../infrastructure/logger/logger";
import { getProductionOverviewUseCase } from "../use-cases/overview/get-production-overview.use-case";

export class OverviewController {
    constructor(private readonly repository: IOverviewRepository) {}

    async getProductionOverview(
        filters: TProductionOverviewFilters,
    ): Promise<Result<TProductionOverview>> {
        try {
            const result = await getProductionOverviewUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[OVERVIEW-CONTROLLER][GET-PRODUCTION-OVERVIEW] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[OVERVIEW-CONTROLLER][GET-PRODUCTION-OVERVIEW] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
