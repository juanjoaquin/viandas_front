import { Result } from "@/src/libs/result";
import {
    TProductionOverview,
    TProductionOverviewFilters,
} from "@/src/architecture/core/domain/entities/Overview";
import { IOverviewRepository } from "@/src/architecture/core/domain/repository/overview/i-overview.repository";
import { HttpClient } from "../../http";

export class OverviewRepository implements IOverviewRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getProductionOverview(
        filters: TProductionOverviewFilters,
    ): Promise<Result<TProductionOverview>> {
        const params = new URLSearchParams({
            from: filters.from,
            to: filters.to,
        });

        return await this.httpClient.get<TProductionOverview>(
            `overview/production?${params.toString()}`,
            {
                tags: ["overview", `overview-${filters.from}-${filters.to}`],
            },
        );
    }
}
