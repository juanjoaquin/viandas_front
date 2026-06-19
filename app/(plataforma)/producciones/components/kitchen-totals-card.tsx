import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TKitchenTotals } from "@/src/architecture/core/domain/entities/DailyProduction";

function formatMoney(value: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

type KitchenTotalsCardProps = {
    totals: TKitchenTotals | null;
};

export function KitchenTotalsCard({ totals }: KitchenTotalsCardProps) {
    const items = totals?.totals ?? [];

    return (
        <section className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <ClipboardList className="size-4" />
                    </span>
                    <div>
                        <h2 className="text-sm font-semibold">Totales de cocina</h2>
                        <p className="text-xs text-muted-foreground">
                            Cantidades por tipo de menú para la fecha seleccionada.
                        </p>
                    </div>
                </div>
                {totals?.grand_total != null ? (
                    <Badge
                        variant="success"
                        className="rounded-lg px-3 py-1.5 text-base font-bold tabular-nums"
                    >
                        {formatMoney(totals.grand_total)}
                    </Badge>
                ) : null}
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Todavía no hay cantidades cargadas para este día.
                </p>
            ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, index) => (
                        <div
                            key={item.menu_type?.id ?? `${item.menu_type?.name ?? "menu-type"}-${index}`}
                            className="rounded-lg border bg-background px-3 py-2"
                        >
                            <p className="truncate text-xs text-muted-foreground">
                                {item.menu_type?.name ?? "Sin tipo"}
                            </p>
                            <div className="mt-1 flex items-end justify-between gap-2">
                                <p className="text-lg font-bold">{item.total_qty}</p>
                                {item.total_amount != null ? (
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {formatMoney(item.total_amount)}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
