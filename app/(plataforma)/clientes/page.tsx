import { Suspense } from "react";
import { CustomersTableData } from "./components/customers-table-data";
import { CustomersTableSkeleton } from "./components/customers-table-skeleton";

export default function ClientesPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Clientes</h1>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTableData />
      </Suspense>
    </div>
  );
}
