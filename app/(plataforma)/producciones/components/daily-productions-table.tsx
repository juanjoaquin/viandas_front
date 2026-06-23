"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import {
    TDailyProduction,
    TDailyProductionFilters,
    TFulfillmentType,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { DailyProductionRowActions } from "./daily-production-row-actions";
import { useTablePagination } from "@/hooks/use-table-pagination";

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

function getColumns(): ColumnDef<TDailyProduction>[] {
    return [{
        key: "customer",
        header: "Cliente",
        cell: (row) => (
            <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">
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
                <div className="min-w-40 divide-y divide-border/50">
                    {row.lines.map((line) => {
                        const menuName = line.menu_type?.name ?? "Sin tipo";

                        return (
                            <div
                                key={line.id}
                                className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1.5 first:pt-0 last:pb-0"
                                aria-label={`${menuName}, cantidad ${line.quantity}`}
                            >
                                <span className="min-w-0 truncate text-sm font-semibold">
                                    {menuName}
                                </span>
                                <Badge
                                    variant="default"
                                    className="w-9 shrink-0 justify-center rounded-md px-1.5 py-0 text-lg font-bold tabular-nums"
                                >
                                    {line.quantity}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <span className="text-muted-foreground">Sin líneas</span>
            ),
    },
    {
        key: "extras",
        header: "Productos",
        cell: (row) =>
            row.extras && row.extras.length > 0 ? (
                <div className="min-w-40 divide-y divide-border/50">
                    {row.extras.map((extra) => {
                        const productName =
                            extra.extra_product?.name ?? "Sin producto";

                        return (
                            <div
                                key={extra.id}
                                className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1.5 first:pt-0 last:pb-0"
                                aria-label={`${productName}, cantidad ${extra.quantity}`}
                            >
                                <span className="min-w-0 truncate text-sm font-semibold">
                                    {productName}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="w-9 shrink-0 justify-center rounded-md px-1.5 py-0 text-lg font-bold tabular-nums"
                                >
                                    {extra.quantity}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <span className="text-muted-foreground">Sin productos</span>
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
                    <p className="text-sm font-medium text-foreground">
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
        mobileCell: (row) =>
            row.notes ? (
                <span className="text-sm">{row.notes}</span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        key: "actions",
        header: "Acciones",
        headerClassName: "w-[1%] text-right",
        cellClassName: "w-[1%] text-right",
        cell: (row) => <DailyProductionRowActions production={row} />,
    }];
}

type DailyProductionsTableProps = {
    productions: TDailyProduction[];
    meta?: PaginationMeta;
    filters?: TDailyProductionFilters;
};

export function DailyProductionsTable({
    productions,
    meta,
    filters,
}: DailyProductionsTableProps) {
    const hasFilters = Boolean(
        filters?.q ||
            filters?.fulfillment_type ||
            filters?.menu_type_id ||
            filters?.delivery_id,
    );
    const { goToPage } = useTablePagination();

    return (
        <DataTable
            columns={getColumns()}
            data={productions}
            meta={meta}
            onPageChange={goToPage}
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
