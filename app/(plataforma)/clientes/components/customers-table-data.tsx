import { getAllCustomersAction } from "@/src/architecture/actions/customer/get-all-customers.action";
import { CustomerType } from "@/src/architecture/core/domain/customer/get-customers-filters";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { CustomersTable } from "./customers-table";

type CustomersTableDataProps = {
  q?: string;
  type?: string;
  page?: string;
  limit?: string;
};

export async function CustomersTableData({ q, type, page, limit }: CustomersTableDataProps) {
  const validType = type === "COMPANY" || type === "PERSON" ? (type as CustomerType) : undefined;
  const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
  const filters = {
    ...(q && { q }),
    ...(validType && { type: validType }),
    page: currentPage,
    limit: currentLimit,
  };
  const result = await getAllCustomersAction(filters);

  if (!result.success) {
    return <div>Error al obtener los clientes</div>;
  }

  const customers = result.data?.items ?? [];
  const meta = result.data?.meta;

  return (
    <CustomersTable
      customers={customers}
      meta={meta}
      q={q}
      type={type}
    />
  );
}
