"use client";

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";
import { SearchInput } from "../../../../components/custom/search-input";
import { ProductCategoryID } from "./product-category-id";
import { ProductCategoriesActiveToggle } from "./product-categories-active-toggle";

function ActiveBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? "success" : "destructive"} className="gap-1">
            {active ? (
                <Check className="size-3" aria-hidden />
            ) : (
                <X className="size-3" aria-hidden />
            )}
            {active ? "Activa" : "Inactiva"}
        </Badge>
    );
}

const columns: ColumnDef<TProductCategory>[] = [
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
        key: "active",
        header: "Estado",
        cell: (row) => <ActiveBadge active={row.active} />,
    },
    {
        key: "actions",
        header: "Acciones",
        headerClassName: "w-[1%] text-right",
        cellClassName: "w-[1%] text-right",
        cell: (row) => <ProductCategoryID category={row} />,
    },
];

type ProductCategoriesTableProps = {
    categories: TProductCategory[];
    q?: string;
    active?: string;
};

export function ProductCategoriesTable({
    categories,
    q,
    active,
}: ProductCategoriesTableProps) {
    const hasFilters = Boolean(q || active);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
                <ProductCategoriesActiveToggle active={active} />
                <SearchInput q={q} />
            </div>
            <DataTable
                columns={columns}
                data={categories}
                emptyMessage={
                    hasFilters ? "Sin coincidencias" : "Sin categorías"
                }
                emptyDescription={
                    hasFilters
                        ? "No se encontraron categorías que coincidan con los filtros aplicados."
                        : "Aún no hay categorías registradas. Agregá la primera."
                }
            />
        </div>
    );
}
