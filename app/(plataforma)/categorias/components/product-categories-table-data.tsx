import { getAllProductCategoriesAction } from "@/src/architecture/actions/product-category/get-all-product-categories.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { ProductCategoriesTable } from "./product-categories-table";

type ProductCategoriesTableDataProps = {
    q?: string;
    active?: string;
    page?: string;
    limit?: string;
};

export async function ProductCategoriesTableData({
    q,
    active,
    page,
    limit,
}: ProductCategoriesTableDataProps) {
    const validActive =
        active === "true" ? true : active === "false" ? false : undefined;
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        ...(validActive !== undefined && { active: validActive }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllProductCategoriesAction(filters);

    if (!result.success) {
        return <div>Error al obtener las categorías</div>;
    }

    return (
        <ProductCategoriesTable
            categories={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
            active={active}
        />
    );
}
