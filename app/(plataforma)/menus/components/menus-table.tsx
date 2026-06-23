"use client";

import { Check, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { SearchInput } from "../../../../components/custom/search-input";
import { MenuTypeID } from "./menu-type-id";
import { MenusActiveToggle } from "./menus-active-toggle";
import { useTablePagination } from "@/hooks/use-table-pagination";

const priceFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

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

const columns: ColumnDef<TMenuType>[] = [
    {
        key: "name",
        header: "Nombre",
        cell: (row) => (
            <p className="truncate font-semibold text-foreground">
                {row.name}
            </p>
        ),
    },
    {
        key: "price",
        header: "Precio",
        cell: (row) =>
            row.price != null ? (
                <span className="text-sm">
                    {priceFormatter.format(row.price)}
                </span>
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
        cell: (row) => <MenuTypeID menuType={row} />,
    },
];

type MenusTableProps = {
    menuTypes: TMenuType[];
    meta?: PaginationMeta;
    q?: string;
    active?: string;
};

export function MenusTable({ menuTypes, meta, q, active }: MenusTableProps) {
    const hasFilters = Boolean(q || active);
    const { goToPage } = useTablePagination();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
                <MenusActiveToggle active={active} />
                <SearchInput q={q} className="w-full md:w-64" />
            </div>
            <DataTable
                columns={columns}
                data={menuTypes}
                meta={meta}
                onPageChange={goToPage}
                emptyMessage={hasFilters ? "Sin coincidencias" : "Sin menús"}
                emptyDescription={
                    hasFilters
                        ? "No se encontraron tipos de menú que coincidan con los filtros aplicados."
                        : "Aún no hay tipos de menú registrados. Agregá el primero."
                }
            />
        </div>
    );
}
