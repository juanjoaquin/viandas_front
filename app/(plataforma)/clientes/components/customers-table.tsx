"use client";

import { Briefcase, User } from "lucide-react";
import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { CustomerType } from "@/src/architecture/core/domain/customer/get-customers-filters";
import { getCustomerTypeLabel } from "@/src/architecture/core/domain/customer/customer-type";
import { ColumnDef, DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "../../../../components/custom/search-input";
import { CustomersTypeToggle } from "./customers-type-toggle";
import { CustomerID } from "./customer-id";

type BadgeVariant = "success" | "info" | "warning" | "secondary";

const TYPE_BADGE: Record<CustomerType, BadgeVariant> = {
  COMPANY: "info",
  PERSON: "success",
};

const TYPE_ICON: Record<CustomerType, React.ElementType> = {
  COMPANY: Briefcase,
  PERSON: User,
};

function TypeBadge({ type }: { type: CustomerType }) {
  const variant: BadgeVariant = TYPE_BADGE[type] ?? "secondary";
  const Icon = TYPE_ICON[type];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="size-3" />
      {getCustomerTypeLabel(type)}
    </Badge>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {initial}
    </span>
  );
}

const columns: ColumnDef<TCustomer>[] = [
  {
    key: "name",
    header: "Nombre",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <CustomerAvatar name={row.name} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
            {row.name}
          </p>
        </div>
      </div>
    ),
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
        <span className="font-mono tabular-nums text-sm">{row.phone}</span>
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
  {
    key: "actions",
    header: "Acciones",
    headerClassName: "w-[1%] text-right",
    cellClassName: "w-[1%] text-right",
    cell: (row) => <CustomerID customer={row} />,
  },
];

type CustomersTableProps = {
  customers: TCustomer[];
  q?: string;
  type?: string;
};

export function CustomersTable({ customers, q, type }: CustomersTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
        <CustomersTypeToggle type={type} />
        <SearchInput q={q} />
      </div>
      <DataTable
        columns={columns}
        data={customers}
        emptyMessage={q || type ? "Sin coincidencias" : "Sin clientes"}
        emptyDescription={
          q || type
            ? "No se encontraron clientes que coincidan con los filtros aplicados."
            : "Aún no hay clientes registrados. Agregá el primero."
        }
      />
    </div>
  );
}
