import { getAllDeliveriesAction } from "@/src/architecture/actions/delivery/get-all-deliveries.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { DeliveriesTable } from "./deliveries-table";

type DeliveriesTableDataProps = {
    q?: string;
    page?: string;
    limit?: string;
};

export async function DeliveriesTableData({ q, page, limit }: DeliveriesTableDataProps) {
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllDeliveriesAction(filters);

    if (!result.success) {
        return <div>Error al obtener los deliveries</div>;
    }

    return (
        <DeliveriesTable
            deliveries={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
        />
    );
}
