import { getAllMenuTypesAction } from "@/src/architecture/actions/menu-type/get-all-menu-types.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { MenusTable } from "./menus-table";

type MenusTableDataProps = {
    q?: string;
    active?: string;
    page?: string;
    limit?: string;
};

export async function MenusTableData({ q, active, page, limit }: MenusTableDataProps) {
    const validActive =
        active === "true" ? true : active === "false" ? false : undefined;
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        ...(validActive !== undefined && { active: validActive }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllMenuTypesAction(filters);

    if (!result.success) {
        return <div>Error al obtener los menús</div>;
    }

    return (
        <MenusTable
            menuTypes={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
            active={active}
        />
    );
}
