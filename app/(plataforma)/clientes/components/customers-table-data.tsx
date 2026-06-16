import { getAllCustomersAction } from "@/src/architecture/actions/customer/getAllCustomers.action";
import { CustomersTable } from "./customers-table";

export async function CustomersTableData() {
  const result = await getAllCustomersAction();

  if (!result.success) {
    return <div>Error al obtener los clientes</div>;
  }

  const customers = result.data && result.data.length > 0 ? result.data : [];

  return <CustomersTable customers={customers} />;
}
