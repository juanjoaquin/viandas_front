import { appendPaginationParams, Paginated } from "@/src/architecture/core/domain/pagination";
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
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { IDailyProductionRepository } from "@/src/architecture/core/domain/repository/daily-production/i-daily-production.repository";
import { HttpClient } from "../../http";

export class DailyProductionRepository implements IDailyProductionRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getByDate(
        date: string,
        filters?: TDailyProductionFilters,
    ): Promise<Result<Paginated<TDailyProduction>>> {
        const params = new URLSearchParams({ date });
        if (filters?.q) params.set("q", filters.q);
        if (filters?.fulfillment_type) {
            params.set("fulfillment_type", filters.fulfillment_type);
        }
        if (filters?.menu_type_id) params.set("menu_type_id", filters.menu_type_id);
        if (filters?.delivery_id) params.set("delivery_id", filters.delivery_id);
        if (filters?.sort) params.set("sort", filters.sort);
        if (filters?.order) params.set("order", filters.order);
        appendPaginationParams(params, filters);

        return await this.httpClient.getPaginated<TDailyProduction>(
            `daily-productions?${params.toString()}`,
            {
                tags: ["daily-productions", `daily-productions-${date}`],
            },
        );
    }

    async create(data: CreateDailyProductionPayload): Promise<Result<TDailyProduction>> {
        return await this.httpClient.post<TDailyProduction>("daily-productions", data);
    }

    async getKitchenTotals(date: string): Promise<Result<TKitchenTotals>> {
        const params = new URLSearchParams({ date });

        return await this.httpClient.get<TKitchenTotals>(
            `daily-productions/totals/kitchen?${params.toString()}`,
            {
                tags: ["daily-productions", `daily-productions-${date}`],
            },
        );
    }

    async getExtrasTotals(date: string): Promise<Result<TExtrasTotals>> {
        const params = new URLSearchParams({ date });

        return await this.httpClient.get<TExtrasTotals>(
            `daily-productions/totals/extras?${params.toString()}`,
            {
                tags: ["daily-productions", `daily-productions-${date}`],
            },
        );
    }

    async update(data: UpdateDailyProductionPayload): Promise<Result<void>> {
        return await this.httpClient.put<void>("daily-productions", data);
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("daily-productions", { id });
    }

    async upsertLine(
        dailyProductionId: string,
        data: UpsertDailyProductionLineInput,
    ): Promise<Result<TDailyProductionLine>> {
        return await this.httpClient.put<TDailyProductionLine>(
            `daily-productions/${dailyProductionId}/lines`,
            data,
        );
    }

    async deleteLine(dailyProductionId: string, lineId: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>(
            `daily-productions/${dailyProductionId}/lines/${lineId}`,
        );
    }

    async addExtra(
        dailyProductionId: string,
        data: AddDailyProductionExtraInput,
    ): Promise<Result<TDailyProductionExtra>> {
        return await this.httpClient.post<TDailyProductionExtra>(
            `daily-productions/${dailyProductionId}/extras`,
            data,
        );
    }

    async updateExtra(
        dailyProductionId: string,
        extraId: string,
        data: UpdateDailyProductionExtraInput,
    ): Promise<Result<TDailyProductionExtra>> {
        return await this.httpClient.put<TDailyProductionExtra>(
            `daily-productions/${dailyProductionId}/extras/${extraId}`,
            data,
        );
    }

    async deleteExtra(
        dailyProductionId: string,
        extraId: string,
    ): Promise<Result<void>> {
        return await this.httpClient.delete<void>(
            `daily-productions/${dailyProductionId}/extras/${extraId}`,
        );
    }
}
