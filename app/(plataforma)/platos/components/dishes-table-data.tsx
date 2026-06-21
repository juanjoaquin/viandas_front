import { getAllDishesAction } from "@/src/architecture/actions/dish/get-all-dishes.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { DishesTable } from "./dishes-table";

type DishesTableDataProps = {
    q?: string;
    menuTypeId?: string;
    page?: string;
    limit?: string;
};

export async function DishesTableData({ q, menuTypeId, page, limit }: DishesTableDataProps) {
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        ...(menuTypeId && { menu_type_id: menuTypeId }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllDishesAction(filters);

    if (!result.success) {
        return <div>Error al obtener los platos</div>;
    }

    return (
        <DishesTable
            dishes={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
            menuTypeId={menuTypeId}
        />
    );
}
