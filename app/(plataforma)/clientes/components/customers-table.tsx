"use client";

import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

type BadgeVariant = "success" | "info" | "warning" | "secondary";

const TYPE_BADGE: Record<string, BadgeVariant> = {
  empresa: "info",
  particular: "success",
  corporativo: "warning",
};

function TypeBadge({ type }: { type: string }) {
  const normalized = type.toLowerCase().trim();
  const variant: BadgeVariant = TYPE_BADGE[normalized] ?? "secondary";
  return (
    <Badge variant={variant}>
      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
    </Badge>
  );
}

const columns: ColumnDef<TCustomer>[] = [
  {
    key: "name",
    header: "Nombre",
    accessorKey: "name",
  },
  {
    key: "type",
    header: "Tipo",
    cell: (row) => <TypeBadge type={row.type} />,
  },
  {
    key: "phone",
    header: "Teléfono",
    cell: (row) =>
      row.phone ? (
        <span className="tabular-nums">{row.phone}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "address",
    header: "Dirección",
    cell: (row) =>
      row.address ? (
        <span className="max-w-xs truncate">{row.address}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

type CustomersTableProps = {
  customers: TCustomer[];
  q?: string;
};

export function CustomersTable({ customers, q }: CustomersTableProps) {
  return (
    <DataTable
      columns={columns}
      data={customers}
      emptyMessage={q ? "Sin coincidencias" : "Sin clientes"}
      emptyDescription={
        q
          ? `No se encontraron clientes que coincidan con "${q}".`
          : "Aún no hay clientes registrados. Agregá el primero."
      }
    />
  );
}
