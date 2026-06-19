"use client";

import { Check, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TDish } from "@/src/architecture/core/domain/entities/Dish";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { SearchInput } from "../../../../components/custom/search-input";
import { DishID } from "./dish-id";
import { DishesMenuTypeSelect } from "./dishes-menu-type-select";

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

function getColumns(menuTypes: TMenuType[]): ColumnDef<TDish>[] {
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
            cell: (row) => <DishID dish={row} menuTypes={menuTypes} />,
        },
    ];
}

type DishesTableProps = {
    dishes: TDish[];
    menuTypes: TMenuType[];
    q?: string;
    menuTypeId?: string;
};

export function DishesTable({ dishes, menuTypes, q, menuTypeId }: DishesTableProps) {
    const hasFilters = Boolean(q || menuTypeId);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
                <DishesMenuTypeSelect menuTypes={menuTypes} menuTypeId={menuTypeId} />
                <SearchInput q={q} />
            </div>
            <DataTable
                columns={getColumns(menuTypes)}
                data={dishes}
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
