import { Suspense } from "react";
import { PageHeader } from "../components/page-header";
import { CreateProductCategoryDialog } from "./components/create-product-category-dialog";
import { ProductCategoriesTableData } from "./components/product-categories-table-data";
import { ProductCategoriesTableSkeleton } from "./components/product-categories-table-skeleton";

type CategoriasPageProps = {
    searchParams: Promise<{ q?: string; active?: string }>;
};

export default async function Page({ searchParams }: CategoriasPageProps) {
    const { q, active } = await searchParams;

    return (
        <>
            <PageHeader
                title="Categorías"
                description="Gestioná las categorías para organizar los productos."
                action={<CreateProductCategoryDialog />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<ProductCategoriesTableSkeleton />}>
                    <ProductCategoriesTableData q={q} active={active} />
                </Suspense>
            </div>
        </>
    );
}
