import { getProductionOverviewAction } from "@/src/architecture/actions/overview/get-production-overview.action";
import { ProductionOverviewSummary } from "./production-overview-summary";

type ProductionOverviewDataProps = {
    from: string;
    to: string;
};

export async function ProductionOverviewData({
    from,
    to,
}: ProductionOverviewDataProps) {
    const result = await getProductionOverviewAction({ from, to });

    if (!result.success) {
        return (
            <div className="rounded-xl border bg-card p-4 text-sm text-destructive shadow-xs">
                Error al obtener el overview de producción.
            </div>
        );
    }

    return <ProductionOverviewSummary overview={result.data} />;
}
