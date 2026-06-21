"use client";

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { TExtraProduct } from "@/src/architecture/core/domain/entities/ExtraProduct";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { SearchInput } from "../../../../components/custom/search-input";
import { ExtraProductID } from "./extra-product-id";
import { useTablePagination } from "@/hooks/use-table-pagination";

function CategoryBadge({ category }: { category?: TProductCategory | null }) {
    return (
        <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700"
        >
            {category?.name ?? "Sin categoría"}
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

function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(price);
}

const columns: ColumnDef<TExtraProduct>[] = [
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
        key: "category",
        header: "Categoría",
        cell: (row) => <CategoryBadge category={row.category} />,
    },
    {
        key: "price",
        header: "Precio",
        cell: (row) => (
            <p className="font-medium tabular-nums text-slate-900 dark:text-slate-50">
                {formatPrice(row.price)}
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
        cell: (row) => <ExtraProductID product={row} />,
    },
];

type ExtraProductsTableProps = {
    products: TExtraProduct[];
    meta?: PaginationMeta;
    q?: string;
};

export function ExtraProductsTable({ products, meta, q }: ExtraProductsTableProps) {
    const { goToPage } = useTablePagination();

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
                <SearchInput q={q} />
            </div>
            <DataTable
                columns={columns}
                data={products}
                meta={meta}
                onPageChange={goToPage}
                emptyMessage={q ? "Sin coincidencias" : "Sin productos"}
                emptyDescription={
                    q
                        ? "No se encontraron productos que coincidan con la búsqueda."
                        : "Aún no hay productos extra registrados."
                }
            />
        </div>
    );
}
