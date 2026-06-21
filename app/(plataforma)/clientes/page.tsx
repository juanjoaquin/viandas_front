import { Suspense } from "react";
import { CustomersTableData } from "./components/customers-table-data";
import { CustomersTableSkeleton } from "./components/customers-table-skeleton";
import { CreateCustomerDialog } from "./components/create-customer-dialog";
import { PageHeader } from "../components/page-header";

type ClientesPageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string; limit?: string }>;
};

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const { q, type, page, limit } = await searchParams;

  return (
    <>
      <PageHeader
        title="Cartera de Clientes"
        description="Gestioná eficientemente tus viandas de personas y empresas. Controlá tipos de menús, turnos y etiquetas de despacho."
        action={<CreateCustomerDialog />}
      />
      <div className="flex flex-col gap-4 p-6">
        <Suspense fallback={<CustomersTableSkeleton />}>
          <CustomersTableData q={q} type={type} page={page} limit={limit} />
        </Suspense>
      </div>
    </>
  );
}
