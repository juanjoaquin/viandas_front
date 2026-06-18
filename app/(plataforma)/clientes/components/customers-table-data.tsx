import { getAllCustomersAction } from "@/src/architecture/actions/customer/get-all-customers.action";
import { CustomerType } from "@/src/architecture/core/domain/customer/get-customers-filters";
import { CustomersTable } from "./customers-table";

type CustomersTableDataProps = {
  q?: string;
  type?: string;
};

export async function CustomersTableData({ q, type }: CustomersTableDataProps) {
  const validType = type === "COMPANY" || type === "PERSON" ? (type as CustomerType) : undefined;
  const filters = q || validType ? { ...(q && { q }), ...(validType && { type: validType }) } : undefined;
  const result = await getAllCustomersAction(filters);

  if (!result.success) {
    return <div>Error al obtener los clientes</div>;
  }

  const customers = result.data && result.data.length > 0 ? result.data : [];

  return <CustomersTable customers={customers} q={q} type={type} />;
}
