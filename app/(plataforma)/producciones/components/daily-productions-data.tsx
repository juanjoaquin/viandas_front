import { getDailyProductionsByDateAction } from "@/src/architecture/actions/daily-production/get-daily-productions-by-date.action";
import { getKitchenTotalsAction } from "@/src/architecture/actions/daily-production/get-kitchen-totals.action";
import { TDailyProductionFilters } from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { DailyProductionsTable } from "./daily-productions-table";
import { KitchenTotalsCard } from "./kitchen-totals-card";

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
    const [productionsResult, totalsResult] = await Promise.all([
        getDailyProductionsByDateAction(date, filters),
        getKitchenTotalsAction(date),
    ]);

    if (!productionsResult.success) {
        return (
            <div className="rounded-xl border bg-card p-4 text-sm text-destructive shadow-xs">
                Error al obtener las producciones del día.
            </div>
        );
    }

    const productions = productionsResult.data ?? [];
    const totals = totalsResult.success ? totalsResult.data : null;

    return (
        <div className="space-y-4">
            <KitchenTotalsCard totals={totals} />
            <DailyProductionsTable
                productions={productions}
                menuTypes={menuTypes}
                deliveries={deliveries}
                filters={filters}
            />
        </div>
    );
}
