import { Suspense } from "react";
import { PageHeader } from "../components/page-header";
import { DishesTableData } from "./components/dishes-table-data";
import { DishesTableSkeleton } from "./components/dishes-table-skeleton";
import { CreateDishDialog } from "./components/create-dish-dialog";
import { getAllMenuTypesAction } from "@/src/architecture/actions/menu-type/get-all-menu-types.action";

type PlatosPageProps = {
    searchParams: Promise<{ q?: string; menu_type_id?: string }>;
};

export default async function Page({ searchParams }: PlatosPageProps) {
    const { q, menu_type_id: menuTypeId } = await searchParams;

    const menuTypesResult = await getAllMenuTypesAction();
    const menuTypes = menuTypesResult.success ? (menuTypesResult.data ?? []) : [];

    return (
        <>
            <PageHeader
                title="Platos"
                description="Consultá los platos registrados. Filtrá por tipo de menú o nombre y revisá su estado."
                action={<CreateDishDialog menuTypes={menuTypes} />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<DishesTableSkeleton />}>
                    <DishesTableData q={q} menuTypeId={menuTypeId} />
                </Suspense>
            </div>
        </>
    );
}
