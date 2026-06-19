"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import {
    TDailyProduction,
    TDailyProductionFilters,
    TFulfillmentType,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { DailyProductionRowActions } from "./daily-production-row-actions";

const fulfillmentLabels: Record<TFulfillmentType, string> = {
    PENDING: "Pendiente",
    DELIVERY: "Delivery",
    PICKUP: "Retiro en local",
};

const fulfillmentVariants: Record<TFulfillmentType, "warning" | "info" | "success"> = {
    PENDING: "warning",
    DELIVERY: "info",
    PICKUP: "success",
};

function getColumns(
    menuTypes: TMenuType[],
    deliveries: TDelivery[],
): ColumnDef<TDailyProduction>[] {
    return [{
        key: "customer",
        header: "Cliente",
        cell: (row) => (
            <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
                    {row.customer?.name ?? "Sin cliente"}
                </p>
                {row.customer?.type ? (
                    <p className="text-xs text-muted-foreground">
                        {row.customer.type === "COMPANY" ? "Empresa" : "Particular"}
                    </p>
                ) : null}
            </div>
        ),
    },
    {
        key: "lines",
        header: "Menús",
        cell: (row) =>
            row.lines && row.lines.length > 0 ? (
                <div className="divide-y divide-border/50">
                    {row.lines.map((line) => (
                        <div
                            key={line.id}
                            className="flex items-center gap-2  first:pt-0 last:pb-0"
                        >
                            <span className="min-w-0 truncate text-sm font-semibold">
                                {line.menu_type?.name ?? "Sin tipo"}
                            </span>
                            <span
                                className="shrink-0 text-sm text-muted-foreground"
                                aria-hidden
                            >
                                x
                            </span>
                            <Badge
                                variant="default"
                                className="w-8 shrink-0 justify-center rounded-md px-1.5 py-0 text-lg font-bold tabular-nums"
                            >
                                {line.quantity}
                            </Badge>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="text-muted-foreground">Sin líneas</span>
            ),
    },
    {
        key: "fulfillment_type",
        header: "Entrega",
        cell: (row) => (
            <Badge variant={fulfillmentVariants[row.fulfillment_type]}>
                {fulfillmentLabels[row.fulfillment_type]}
            </Badge>
        ),
    },
    {
        key: "delivery",
        header: "Repartidor",
        cell: (row) =>
            row.delivery ? (
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {row.delivery.name}
                    </p>
                    {row.delivery.phone ? (
                        <p className="text-xs text-muted-foreground">
                            {row.delivery.phone}
                        </p>
                    ) : null}
                </div>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        key: "notes",
        header: "Notas",
        cell: (row) =>
            row.notes ? (
                <span className="line-clamp-2 text-sm">{row.notes}</span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        key: "actions",
        header: "Acciones",
        headerClassName: "w-[1%] text-right",
        cellClassName: "w-[1%] text-right",
        cell: (row) => (
            <DailyProductionRowActions
                production={row}
                menuTypes={menuTypes}
                deliveries={deliveries}
            />
        ),
    }];
}

type DailyProductionsTableProps = {
    productions: TDailyProduction[];
    menuTypes: TMenuType[];
    deliveries: TDelivery[];
    filters?: TDailyProductionFilters;
};

export function DailyProductionsTable({
    productions,
    menuTypes,
    deliveries,
    filters,
}: DailyProductionsTableProps) {
    const hasFilters = Boolean(
        filters?.q ||
            filters?.fulfillment_type ||
            filters?.menu_type_id ||
            filters?.delivery_id,
    );

    return (
        <DataTable
            columns={getColumns(menuTypes, deliveries)}
            data={productions}
            emptyMessage={
                hasFilters ? "Sin coincidencias" : "Sin producciones para este día"
            }
            emptyDescription={
                hasFilters
                    ? "No se encontraron producciones que coincidan con los filtros aplicados."
                    : "Cuando cargues una producción, va a aparecer en este listado."
            }
        />
    );
}
