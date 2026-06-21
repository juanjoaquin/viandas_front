import { ClipboardList, Package, Receipt } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TProductionOverview } from "@/src/architecture/core/domain/entities/Overview";

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

type OverviewKpiCardProps = {
    icon: React.ReactNode;
    title: string;
    amount: number;
    quantityLabel: string;
    prominent?: boolean;
};

function OverviewKpiCard({
    icon,
    title,
    amount,
    quantityLabel,
    prominent = false,
}: OverviewKpiCardProps) {
    return (
        <Card className={prominent ? "ring-brand/30 bg-brand/5" : undefined}>
            <CardHeader>
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
                    <CardTitle className="text-sm">{title}</CardTitle>
                </div>
                <CardDescription>{quantityLabel}</CardDescription>
            </CardHeader>
            <CardContent>
                <p
                    className={
                        prominent
                            ? "text-2xl font-bold tabular-nums text-brand"
                            : "text-2xl font-bold tabular-nums"
                    }
                >
                    {formatMoney(amount)}
                </p>
            </CardContent>
        </Card>
    );
}

type BreakdownCardProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    emptyMessage: string;
    items: Array<{
        id?: string;
        name: string;
        quantity: number;
        amount: number;
    }>;
};

function BreakdownCard({
    title,
    description,
    icon,
    emptyMessage,
    items,
}: BreakdownCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{icon}</span>
                    <CardTitle>{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                ) : (
                    <div className="grid gap-2">
                        {items.map((item, index) => (
                            <div
                                key={item.id ?? `${item.name}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatUnitLabel(item.quantity, "unidad", "unidades")}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold tabular-nums">
                                    {formatMoney(item.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type ProductionOverviewSummaryProps = {
    overview: TProductionOverview;
};

export function ProductionOverviewSummary({
    overview,
}: ProductionOverviewSummaryProps) {
    const { summary } = overview;
    const periodLabel = `${formatDateLabel(overview.period.from)} - ${formatDateLabel(
        overview.period.to,
    )}`;

    const menuItems = overview.menus_by_type.map((item) => ({
        id: item.menu_type?.id,
        name: item.menu_type?.name ?? "Sin tipo",
        quantity: item.total_qty,
        amount: item.total_amount ?? 0,
    }));

    const productItems = overview.products.map((item) => ({
        id: item.extra_product?.id,
        name: item.extra_product?.name ?? "Sin producto",
        quantity: item.total_qty,
        amount: item.total_amount,
    }));

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold">Resumen del periodo</h2>
                <p className="text-xs text-muted-foreground">{periodLabel}</p>
            </div>

            <section className="grid gap-3 md:grid-cols-3">
                <OverviewKpiCard
                    icon={<ClipboardList className="size-4" />}
                    title="Total menús"
                    amount={summary.total_menus_amount}
                    quantityLabel={formatUnitLabel(
                        summary.total_menus_qty,
                        "vianda",
                        "viandas",
                    )}
                />
                <OverviewKpiCard
                    icon={<Package className="size-4" />}
                    title="Total productos"
                    amount={summary.total_products_amount}
                    quantityLabel={formatUnitLabel(
                        summary.total_products_qty,
                        "producto",
                        "productos",
                    )}
                />
                <OverviewKpiCard
                    icon={<Receipt className="size-4" />}
                    title="Total general"
                    amount={summary.grand_total_amount}
                    quantityLabel={formatUnitLabel(
                        summary.total_menus_qty + summary.total_products_qty,
                        "item",
                        "items",
                    )}
                    prominent
                />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <BreakdownCard
                    title="Menús por tipo"
                    description="Cantidad de viandas y monto total por tipo de menú."
                    icon={<ClipboardList className="size-4" />}
                    emptyMessage="Sin menús cargados para este rango."
                    items={menuItems}
                />
                <BreakdownCard
                    title="Productos"
                    description="Cantidad y monto total por producto."
                    icon={<Package className="size-4" />}
                    emptyMessage="Sin productos cargados para este rango."
                    items={productItems}
                />
            </section>
        </div>
    );
}
