"use client";

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { SearchInput } from "../../../../components/custom/search-input";
import { ProductCategoryID } from "./product-category-id";
import { ProductCategoriesActiveToggle } from "./product-categories-active-toggle";
import { useTablePagination } from "@/hooks/use-table-pagination";

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
            <p className="truncate font-semibold text-foreground">
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
    meta?: PaginationMeta;
    q?: string;
    active?: string;
};

export function ProductCategoriesTable({
    categories,
    meta,
    q,
    active,
}: ProductCategoriesTableProps) {
    const hasFilters = Boolean(q || active);
    const { goToPage } = useTablePagination();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
                <ProductCategoriesActiveToggle active={active} />
                <SearchInput q={q} className="w-full md:w-64" />
            </div>
            <DataTable
                columns={columns}
                data={categories}
                meta={meta}
                onPageChange={goToPage}
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
