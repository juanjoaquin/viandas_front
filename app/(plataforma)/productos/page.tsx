import { Suspense } from "react";
import { getAllProductCategoriesAction } from "@/src/architecture/actions/product-category/get-all-product-categories.action";
import { PageHeader } from "../components/page-header";
import { CreateExtraProductDialog } from "./components/create-extra-product-dialog";
import { ExtraProductsTableData } from "./components/extra-products-table-data";
import { ExtraProductsTableSkeleton } from "./components/extra-products-table-skeleton";

type ProductosPageProps = {
    searchParams: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: ProductosPageProps) {
    const { q } = await searchParams;
    const categoriesResult = await getAllProductCategoriesAction({ active: true });
    const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];

    return (
        <>
            <PageHeader
                title="Productos"
                description="Administrá productos extra y asocialos a una categoría."
                action={<CreateExtraProductDialog categories={categories} />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<ExtraProductsTableSkeleton />}>
                    <ExtraProductsTableData q={q} />
                </Suspense>
            </div>
        </>
    );
}
