import { getAllCustomersAction } from "@/src/architecture/actions/customer/get-all-customers.action";
import { CustomersTable } from "./customers-table";

type CustomersTableDataProps = {
  q?: string;
};

export async function CustomersTableData({ q }: CustomersTableDataProps) {
  const result = await getAllCustomersAction(q ? { q } : undefined);

  if (!result.success) {
    return <div>Error al obtener los clientes</div>;
  }

  const customers = result.data && result.data.length > 0 ? result.data : [];

  return <CustomersTable customers={customers} q={q} />;
}
