import { getAllExtraProductsAction } from "@/src/architecture/actions/extra-product/get-all-extra-products.action";
import { getDailyProductionsByDateAction } from "@/src/architecture/actions/daily-production/get-daily-productions-by-date.action";
import { getExtrasTotalsAction } from "@/src/architecture/actions/daily-production/get-extras-totals.action";
import { getKitchenTotalsAction } from "@/src/architecture/actions/daily-production/get-kitchen-totals.action";
import { TDailyProductionFilters } from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { DailyProductionSummary } from "./daily-production-summary";
import { DailyProductionsTable } from "./daily-productions-table";

type DailyProductionsDataProps = {
    date: string;
    filters?: TDailyProductionFilters;
    menuTypes: TMenuType[];
    deliveries: TDelivery[];
};

export async function DailyProductionsData({
    date,
    filters,
    menuTypes,
    deliveries,
}: DailyProductionsDataProps) {
    const [productionsResult, kitchenTotalsResult, extrasTotalsResult, extraProductsResult] =
        await Promise.all([
        getDailyProductionsByDateAction(date, filters),
        getKitchenTotalsAction(date),
        getExtrasTotalsAction(date),
        getAllExtraProductsAction(),
    ]);

    if (!productionsResult.success) {
        return (
            <div className="rounded-xl border bg-card p-4 text-sm text-destructive shadow-xs">
                Error al obtener las producciones del día.
            </div>
        );
    }

    const productions = productionsResult.data ?? [];
    const kitchenTotals = kitchenTotalsResult.success ? kitchenTotalsResult.data : null;
    const extrasTotals = extrasTotalsResult.success ? extrasTotalsResult.data : null;
    const extraProducts = extraProductsResult.success
        ? (extraProductsResult.data ?? []).filter((product) => product.active)
        : [];

    return (
        <div className="space-y-4">
            <DailyProductionSummary
                date={date}
                kitchenTotals={kitchenTotals}
                extrasTotals={extrasTotals}
            />
            <DailyProductionsTable
                productions={productions}
                menuTypes={menuTypes}
                deliveries={deliveries}
                extraProducts={extraProducts}
                filters={filters}
            />
        </div>
    );
}
