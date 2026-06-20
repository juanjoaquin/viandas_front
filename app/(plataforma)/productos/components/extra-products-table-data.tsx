import { getAllExtraProductsAction } from "@/src/architecture/actions/extra-product/get-all-extra-products.action";
import { getAllProductCategoriesAction } from "@/src/architecture/actions/product-category/get-all-product-categories.action";
import { ExtraProductsTable } from "./extra-products-table";

type ExtraProductsTableDataProps = {
    q?: string;
};

export async function ExtraProductsTableData({ q }: ExtraProductsTableDataProps) {
    const filters = q ? { q } : undefined;
    const [result, categoriesResult] = await Promise.all([
        getAllExtraProductsAction(filters),
        getAllProductCategoriesAction(),
    ]);

    if (!result.success) {
        return <div>Error al obtener los productos</div>;
    }

    const products = result.data ?? [];
    const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];

    return (
        <ExtraProductsTable
            products={products}
            categories={categories}
            q={q}
        />
    );
}
