import { Result } from "@/src/libs/result";
import {
    TProductionOverview,
    TProductionOverviewFilters,
} from "../../entities/Overview";

export interface IOverviewRepository {
    getProductionOverview(
        filters: TProductionOverviewFilters,
    ): Promise<Result<TProductionOverview>>;
}
