import { Result } from "@/src/libs/result";
import {
    CreateDailyProductionPayload,
    TDailyProduction,
    TDailyProductionFilters,
    TDailyProductionLine,
    TKitchenTotals,
    UpdateDailyProductionPayload,
    UpsertDailyProductionLineInput,
} from "../../entities/DailyProduction";

export interface IDailyProductionRepository {
    getByDate(
        date: string,
        filters?: TDailyProductionFilters,
    ): Promise<Result<TDailyProduction[]>>;
    create(data: CreateDailyProductionPayload): Promise<Result<TDailyProduction>>;
    getKitchenTotals(date: string): Promise<Result<TKitchenTotals>>;
    update(data: UpdateDailyProductionPayload): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
    upsertLine(
        dailyProductionId: string,
        data: UpsertDailyProductionLineInput,
    ): Promise<Result<TDailyProductionLine>>;
    deleteLine(dailyProductionId: string, lineId: string): Promise<Result<void>>;
}
