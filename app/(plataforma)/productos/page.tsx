import { Suspense } from "react";
import { PageHeader } from "../components/page-header";
import { CreateExtraProductDialog } from "./components/create-extra-product-dialog";
import { ExtraProductsTableData } from "./components/extra-products-table-data";
import { ExtraProductsTableSkeleton } from "./components/extra-products-table-skeleton";

type ProductosPageProps = {
    searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
};

export default async function Page({ searchParams }: ProductosPageProps) {
    const { q, page, limit } = await searchParams;

    return (
        <>
            <PageHeader
                title="Productos"
                description="Administrá productos extra y asocialos a una categoría."
                action={<CreateExtraProductDialog />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<ExtraProductsTableSkeleton />}>
                    <ExtraProductsTableData q={q} page={page} limit={limit} />
                </Suspense>
            </div>
        </>
    );
}
