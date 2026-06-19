import { Err, Result } from "@/src/libs/result";
import {
    CreateDailyProductionPayload,
    TDailyProduction,
    TDailyProductionFilters,
    TDailyProductionLine,
    TKitchenTotals,
    UpdateDailyProductionPayload,
    UpsertDailyProductionLineInput,
} from "../core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "../core/domain/repository/daily-production/i-daily-production.repository";
import { Logger } from "../infrastructure/logger/logger";
import { createDailyProductionUseCase } from "../use-cases/daily-production/create-daily-production.use-case";
import { deleteDailyProductionLineUseCase } from "../use-cases/daily-production/delete-daily-production-line.use-case";
import { deleteDailyProductionUseCase } from "../use-cases/daily-production/delete-daily-production.use-case";
import { getDailyProductionsByDateUseCase } from "../use-cases/daily-production/get-daily-productions-by-date.use-case";
import { getKitchenTotalsUseCase } from "../use-cases/daily-production/get-kitchen-totals.use-case";
import { updateDailyProductionUseCase } from "../use-cases/daily-production/update-daily-production.use-case";
import { upsertDailyProductionLineUseCase } from "../use-cases/daily-production/upsert-daily-production-line.use-case";

export class DailyProductionController {
    constructor(private readonly repository: IDailyProductionRepository) {}

    async getDailyProductionsByDate(
        date: string,
        filters?: TDailyProductionFilters,
    ): Promise<Result<TDailyProduction[]>> {
        try {
            const result = await getDailyProductionsByDateUseCase(
                this.repository,
                date,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][GET-BY-DATE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][GET-BY-DATE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createDailyProduction(
        data: CreateDailyProductionPayload,
    ): Promise<Result<TDailyProduction>> {
        try {
            const result = await createDailyProductionUseCase(
                this.repository,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][CREATE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][CREATE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getKitchenTotals(date: string): Promise<Result<TKitchenTotals>> {
        try {
            const result = await getKitchenTotalsUseCase(this.repository, date);

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][GET-KITCHEN-TOTALS] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][GET-KITCHEN-TOTALS] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateDailyProduction(
        data: UpdateDailyProductionPayload,
    ): Promise<Result<void>> {
        try {
            const result = await updateDailyProductionUseCase(
                this.repository,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][UPDATE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][UPDATE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteDailyProduction(id: string): Promise<Result<void>> {
        try {
            const result = await deleteDailyProductionUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][DELETE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][DELETE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteDailyProductionLine(
        dailyProductionId: string,
        lineId: string,
    ): Promise<Result<void>> {
        try {
            const result = await deleteDailyProductionLineUseCase(
                this.repository,
                dailyProductionId,
                lineId,
            );

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][DELETE-LINE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][DELETE-LINE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async upsertDailyProductionLine(
        dailyProductionId: string,
        data: UpsertDailyProductionLineInput,
    ): Promise<Result<TDailyProductionLine>> {
        try {
            const result = await upsertDailyProductionLineUseCase(
                this.repository,
                dailyProductionId,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[DAILY-PRODUCTION-CONTROLLER][UPSERT-LINE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[DAILY-PRODUCTION-CONTROLLER][UPSERT-LINE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
