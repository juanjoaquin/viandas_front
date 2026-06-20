import { ClipboardList, Receipt, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    TExtrasTotals,
    TKitchenTotals,
} from "@/src/architecture/core/domain/entities/DailyProduction";

function formatMoney(value: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDateLabel(date: string): string {
    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
}

function formatUnitLabel(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

type DailyProductionSummaryProps = {
    date: string;
    kitchenTotals: TKitchenTotals | null;
    extrasTotals: TExtrasTotals | null;
};

type SummaryKpiProps = {
    icon: React.ReactNode;
    label: string;
    amount: number;
    unitsLabel: string;
    prominent?: boolean;
};

function SummaryKpi({ icon, label, amount, unitsLabel, prominent = false }: SummaryKpiProps) {
    return (
        <div
            className={
                prominent
                    ? "rounded-xl border border-brand/30 bg-brand/5 p-4 shadow-xs"
                    : "rounded-xl border bg-card p-4 shadow-xs"
            }
        >
            <div className="flex items-center gap-2">
                <span
                    className={
                        prominent
                            ? "flex size-8 items-center justify-center rounded-lg bg-brand/15 text-brand"
                            : "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                    }
                >
                    {icon}
                </span>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
                <p
                    className={
                        prominent
                            ? "text-xl font-bold tabular-nums text-brand"
                            : "text-lg font-bold tabular-nums"
                    }
                >
                    {formatMoney(amount)}
                </p>
                {prominent ? (
                    <Badge
                        variant="success"
                        className="rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums"
                    >
                        Total
                    </Badge>
                ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{unitsLabel}</p>
        </div>
    );
}

type BreakdownItemProps = {
    name: string;
    quantity: number;
    amount: number | null | undefined;
};

function BreakdownItem({ name, quantity, amount }: BreakdownItemProps) {
    return (
        <div className="rounded-lg border bg-background px-3 py-2">
            <p className="truncate text-xs text-muted-foreground">{name}</p>
            <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-lg font-bold">{quantity}</p>
                {amount != null ? (
                    <p className="text-xs font-medium text-muted-foreground">
                        {formatMoney(amount)}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export function DailyProductionSummary({
    date,
    kitchenTotals,
    extrasTotals,
}: DailyProductionSummaryProps) {
    const kitchenItems = kitchenTotals?.totals ?? [];
    const extrasItems = extrasTotals?.totals ?? [];

    const kitchenAmount = kitchenTotals?.grand_total ?? 0;
    const extrasAmount = extrasTotals?.grand_total ?? 0;
    const dayTotal = kitchenAmount + extrasAmount;

    const kitchenQty = kitchenItems.reduce((sum, item) => sum + item.total_qty, 0);
    const extrasQty = extrasItems.reduce((sum, item) => sum + item.total_qty, 0);

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold">Resumen del día</h2>
                <p className="text-xs text-muted-foreground">{formatDateLabel(date)}</p>
            </div>

            <section className="grid gap-3 sm:grid-cols-3">
                <SummaryKpi
                    icon={<ClipboardList className="size-4" />}
                    label="Menús"
                    amount={kitchenAmount}
                    unitsLabel={formatUnitLabel(kitchenQty, "vianda", "viandas")}
                />
                <SummaryKpi
                    icon={<ShoppingBag className="size-4" />}
                    label="Productos"
                    amount={extrasAmount}
                    unitsLabel={formatUnitLabel(extrasQty, "unidad", "unidades")}
                />
                <SummaryKpi
                    icon={<Receipt className="size-4" />}
                    label="Total del día"
                    amount={dayTotal}
                    unitsLabel={formatUnitLabel(
                        kitchenQty + extrasQty,
                        "ítem",
                        "ítems",
                    )}
                    prominent
                />
            </section>

            <section className="rounded-xl border bg-card p-4 shadow-xs">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold">Detalle de producción</h3>
                    <p className="text-xs text-muted-foreground">
                        Cantidades por tipo de menú y producto.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <ClipboardList className="size-3.5 text-muted-foreground" />
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Cocina
                            </p>
                        </div>
                        {kitchenItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Sin menús cargados para este día.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {kitchenItems.map((item, index) => (
                                    <BreakdownItem
                                        key={
                                            item.menu_type?.id ??
                                            `${item.menu_type?.name ?? "menu-type"}-${index}`
                                        }
                                        name={item.menu_type?.name ?? "Sin tipo"}
                                        quantity={item.total_qty}
                                        amount={item.total_amount}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <ShoppingBag className="size-3.5 text-muted-foreground" />
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Productos
                            </p>
                        </div>
                        {extrasItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Sin productos cargados para este día.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {extrasItems.map((item, index) => (
                                    <BreakdownItem
                                        key={
                                            item.extra_product?.id ??
                                            `${item.extra_product?.name ?? "extra-product"}-${index}`
                                        }
                                        name={item.extra_product?.name ?? "Sin producto"}
                                        quantity={item.total_qty}
                                        amount={item.total_amount}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
