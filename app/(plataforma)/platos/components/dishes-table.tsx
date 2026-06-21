"use client";

import { Check, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TDish } from "@/src/architecture/core/domain/entities/Dish";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { SearchInput } from "../../../../components/custom/search-input";
import { DishID } from "./dish-id";
import { DishesMenuTypeSelect } from "./dishes-menu-type-select";
import { useTablePagination } from "@/hooks/use-table-pagination";

function MenuTypeBadge({ name }: { name: string }) {
    return (
        <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700"
        >
            {name}
        </Badge>
    );
}

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

function getColumns(): ColumnDef<TDish>[] {
    return [
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
            key: "description",
            header: "Descripción",
            cell: (row) => (
                <p className="max-w-xs truncate text-sm text-muted-foreground">
                    {row.description || "—"}
                </p>
            ),
            mobileCell: (row) => (
                <p className="text-sm text-muted-foreground">
                    {row.description || "—"}
                </p>
            ),
        },
        {
            key: "menu_type",
            header: "Tipo de menú",
            cell: (row) =>
                row.menu_type?.name ? (
                    <MenuTypeBadge name={row.menu_type.name} />
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
            cell: (row) => <DishID dish={row} />,
        },
    ];
}

type DishesTableProps = {
    dishes: TDish[];
    meta?: PaginationMeta;
    q?: string;
    menuTypeId?: string;
};

export function DishesTable({ dishes, meta, q, menuTypeId }: DishesTableProps) {
    const hasFilters = Boolean(q || menuTypeId);
    const { goToPage } = useTablePagination();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
                <DishesMenuTypeSelect menuTypeId={menuTypeId} />
                <SearchInput q={q} className="w-full md:w-64" />
            </div>
            <DataTable
                columns={getColumns()}
                data={dishes}
                meta={meta}
                onPageChange={goToPage}
                emptyMessage={hasFilters ? "Sin coincidencias" : "Sin platos"}
                emptyDescription={
                    hasFilters
                        ? "No se encontraron platos que coincidan con los filtros aplicados."
                        : "Aún no hay platos registrados."
                }
            />
        </div>
    );
}
