import { getAllProductCategoriesAction } from "@/src/architecture/actions/product-category/get-all-product-categories.action";
import { ProductCategoriesTable } from "./product-categories-table";

type ProductCategoriesTableDataProps = {
    q?: string;
    active?: string;
};

export async function ProductCategoriesTableData({
    q,
    active,
}: ProductCategoriesTableDataProps) {
    const validActive =
        active === "true" ? true : active === "false" ? false : undefined;
    const filters =
        q || validActive !== undefined
            ? {
                  ...(q && { q }),
                  ...(validActive !== undefined && { active: validActive }),
              }
            : undefined;
    const result = await getAllProductCategoriesAction(filters);

    if (!result.success) {
        return <div>Error al obtener las categorías</div>;
    }

    const categories = result.data && result.data.length > 0 ? result.data : [];

    return (
        <ProductCategoriesTable
            categories={categories}
            q={q}
            active={active}
        />
    );
}
