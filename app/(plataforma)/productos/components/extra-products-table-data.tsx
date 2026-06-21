import { getAllExtraProductsAction } from "@/src/architecture/actions/extra-product/get-all-extra-products.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { ExtraProductsTable } from "./extra-products-table";

type ExtraProductsTableDataProps = {
    q?: string;
    page?: string;
    limit?: string;
};

export async function ExtraProductsTableData({ q, page, limit }: ExtraProductsTableDataProps) {
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllExtraProductsAction(filters);

    if (!result.success) {
        return <div>Error al obtener los productos</div>;
    }

    return (
        <ExtraProductsTable
            products={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
        />
    );
}
