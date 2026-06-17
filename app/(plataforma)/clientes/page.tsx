import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomersTableData } from "./components/customers-table-data";
import { CustomersTableSkeleton } from "./components/customers-table-skeleton";
import { CustomersSearchInput } from "./components/customers-search-input";

type ClientesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná la base de clientes: personas y empresas que reciben
            viandas.
          </p>
        </div>
        <Button size="sm" className="shrink-0">
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>
      <Separator />
      <div className="space-y-4">
        <Suspense
          fallback={<div className="h-8 w-64 animate-pulse rounded-md bg-muted" />}
        >
          <CustomersSearchInput />
        </Suspense>
        <Suspense fallback={<CustomersTableSkeleton />}>
          <CustomersTableData q={q} />
        </Suspense>
      </div>
    </div>
  );
}
