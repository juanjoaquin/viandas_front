import { getAllDeliveriesAction } from "@/src/architecture/actions/delivery/get-all-deliveries.action";
import { DeliveriesTable } from "./deliveries-table";

type DeliveriesTableDataProps = {
    q?: string;
};

export async function DeliveriesTableData({ q }: DeliveriesTableDataProps) {
    const filters = q ? { ...(q && { q }) } : undefined;
    const result = await getAllDeliveriesAction(filters);

    if (!result.success) {
        return <div>Error al obtener los deliveries</div>;
    }

    const deliveries = result.data && result.data.length > 0 ? result.data : [];

    console.log(deliveries);

    return <DeliveriesTable deliveries={deliveries} q={q} />;
}
