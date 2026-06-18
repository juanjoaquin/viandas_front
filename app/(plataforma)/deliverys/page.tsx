import { Suspense } from "react";
import { PageHeader } from "../components/page-header";
import { DeliverysTableSkeleton } from "./components/delivery-table-skeleton";
import { DeliveriesTableData } from "./components/deliveries-data";
import { CreateDeliveryDialog } from "./components/create-delivery-dialog";



type DeliverysPageProps = {
    searchParams: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: DeliverysPageProps) {
    const { q } = await searchParams;

    return (
        <>
            <PageHeader
                title="Deliverys"
                description="Gestioná eficientemente tus deliverys. Controlá nombres, teléfonos y activos."
                action={<CreateDeliveryDialog />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<DeliverysTableSkeleton />}>
                    <DeliveriesTableData q={q} />
                </Suspense>
            </div>
        </>
    )
}

