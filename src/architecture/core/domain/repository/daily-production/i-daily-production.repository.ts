import { Result } from "@/src/libs/result";
import {
    AddDailyProductionExtraInput,
    CreateDailyProductionPayload,
    TDailyProduction,
    TDailyProductionExtra,
    TDailyProductionFilters,
    TDailyProductionLine,
    TKitchenTotals,
    TExtrasTotals,
    UpdateDailyProductionPayload,
    UpdateDailyProductionExtraInput,
    UpsertDailyProductionLineInput,
} from "../../entities/DailyProduction";

export interface IDailyProductionRepository {
    getByDate(
        date: string,
        filters?: TDailyProductionFilters,
    ): Promise<Result<TDailyProduction[]>>;
    create(data: CreateDailyProductionPayload): Promise<Result<TDailyProduction>>;
    getKitchenTotals(date: string): Promise<Result<TKitchenTotals>>;
    getExtrasTotals(date: string): Promise<Result<TExtrasTotals>>;
    update(data: UpdateDailyProductionPayload): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
    upsertLine(
        dailyProductionId: string,
        data: UpsertDailyProductionLineInput,
    ): Promise<Result<TDailyProductionLine>>;
    deleteLine(dailyProductionId: string, lineId: string): Promise<Result<void>>;
    addExtra(
        dailyProductionId: string,
        data: AddDailyProductionExtraInput,
    ): Promise<Result<TDailyProductionExtra>>;
    updateExtra(
        dailyProductionId: string,
        extraId: string,
        data: UpdateDailyProductionExtraInput,
    ): Promise<Result<TDailyProductionExtra>>;
    deleteExtra(dailyProductionId: string, extraId: string): Promise<Result<void>>;
}
