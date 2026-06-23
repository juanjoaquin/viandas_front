"use client";

import { Check, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { SearchInput } from "../../../../components/custom/search-input";
import { DeliveryID } from "./delivery-id";
import { useTablePagination } from "@/hooks/use-table-pagination";

function ActiveBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? "success" : "destructive"} className="gap-1">
            {active ? (
                <Check className="size-3" aria-hidden />
            ) : (
                <X className="size-3" aria-hidden />
            )}
            {active ? "Activo" : "Inactivo"}
        </Badge>
    );
}

function DeliveryAvatar({ name }: { name: string }) {
    const initial = name.trim().charAt(0).toUpperCase();
    return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
            {initial}
        </span>
    );
}

    const columns: ColumnDef<TDelivery>[] = [
    {
        key: "name",
        header: "Nombre",
        cell: (row) => (
            <div className="flex items-center gap-3">
                <DeliveryAvatar name={row.name} />
                <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                        {row.name}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "phone",
        header: "Teléfono",
        cell: (row) =>
            row.phone ? (
                <span className="text-sm">{row.phone}</span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        key: "active",
        header: "Estado",
        cell: (row) => <ActiveBadge active={row.active} />,
    },
    {
        key: "actions",
        header: "Acciones",
        headerClassName: "w-[1%] text-right",
        cellClassName: "w-[1%] text-right",
        cell: (row) => <DeliveryID delivery={row} />,
    },
];

type DeliveriesTableProps = {
    deliveries: TDelivery[];
    meta?: PaginationMeta;
    q?: string;
};

export function DeliveriesTable({ deliveries, meta, q }: DeliveriesTableProps) {
    const { goToPage } = useTablePagination();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
                <SearchInput q={q} className="w-full md:w-64" />
            </div>
            <DataTable
                columns={columns}
                data={deliveries}
                meta={meta}
                onPageChange={goToPage}
                emptyMessage={q ? "Sin coincidencias" : "Sin deliveries"}
                emptyDescription={
                    q
                        ? "No se encontraron deliveries que coincidan con los filtros aplicados."
                        : "Aún no hay deliveries registrados. Agregá el primero."
                }
            />
        </div>
    );
}
