"use client";

import { Check, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { SearchInput } from "../../../../components/custom/search-input";
import { MenuTypeID } from "./menu-type-id";
import { MenusActiveToggle } from "./menus-active-toggle";

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
            <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
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
    q?: string;
    active?: string;
};

export function MenusTable({ menuTypes, q, active }: MenusTableProps) {
    const hasFilters = Boolean(q || active);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
                <MenusActiveToggle active={active} />
                <SearchInput q={q} />
            </div>
            <DataTable
                columns={columns}
                data={menuTypes}
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
