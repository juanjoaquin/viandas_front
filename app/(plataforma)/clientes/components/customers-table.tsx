import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const columns: ColumnDef<TCustomer>[] = [
  {
    key: "name",
    header: "Nombre",
    accessorKey: "name",
  },
  {
    key: "type",
    header: "Tipo",
    accessorKey: "type",
  },
  {
    key: "phone",
    header: "Teléfono",
    cell: (row) => row.phone ?? "—",
  },
  {
    key: "address",
    header: "Dirección",
    cell: (row) => row.address ?? "—",
  },
];

type CustomersTableProps = {
  customers: TCustomer[];
};

export function CustomersTable({ customers }: CustomersTableProps) {
  const toolbar = (
    <>
      <div className="flex items-center gap-2">
        {/* Aquí van los filtros */}
      </div>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Agregar Cliente
      </Button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={customers}
      toolbar={toolbar}
    />
  );
}
