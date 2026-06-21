import { getDailyProductionsByDateAction } from "@/src/architecture/actions/daily-production/get-daily-productions-by-date.action";
import { getExtrasTotalsAction } from "@/src/architecture/actions/daily-production/get-extras-totals.action";
import { getKitchenTotalsAction } from "@/src/architecture/actions/daily-production/get-kitchen-totals.action";
import { TDailyProductionFilters } from "@/src/architecture/core/domain/entities/DailyProduction";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { DailyProductionSummary } from "./daily-production-summary";
import { DailyProductionsTable } from "./daily-productions-table";

type DailyProductionsDataProps = {
    date: string;
    filters?: TDailyProductionFilters;
    page?: string;
    limit?: string;
};

export async function DailyProductionsData({
    date,
    filters,
    page,
    limit,
}: DailyProductionsDataProps) {
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const paginatedFilters: TDailyProductionFilters = {
        ...filters,
        page: currentPage,
        limit: currentLimit,
    };

    const [productionsResult, kitchenTotalsResult, extrasTotalsResult] =
        await Promise.all([
            getDailyProductionsByDateAction(date, paginatedFilters),
            getKitchenTotalsAction(date),
            getExtrasTotalsAction(date),
        ]);

    if (!productionsResult.success) {
        return (
            <div className="rounded-xl border bg-card p-4 text-sm text-destructive shadow-xs">
                Error al obtener las producciones del día.
            </div>
        );
    }

    const kitchenTotals = kitchenTotalsResult.success ? kitchenTotalsResult.data : null;
    const extrasTotals = extrasTotalsResult.success ? extrasTotalsResult.data : null;

    return (
        <div className="space-y-4">
            <DailyProductionSummary
                date={date}
                kitchenTotals={kitchenTotals}
                extrasTotals={extrasTotals}
            />
            <DailyProductionsTable
                productions={productionsResult.data?.items ?? []}
                meta={productionsResult.data?.meta}
                filters={filters}
            />
        </div>
    );
}
