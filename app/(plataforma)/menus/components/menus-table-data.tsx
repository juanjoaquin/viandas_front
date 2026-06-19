import { getAllMenuTypesAction } from "@/src/architecture/actions/menu-type/get-all-menu-types.action";
import { MenusTable } from "./menus-table";

type MenusTableDataProps = {
    q?: string;
    active?: string;
};

export async function MenusTableData({ q, active }: MenusTableDataProps) {
    const validActive =
        active === "true" ? true : active === "false" ? false : undefined;
    const filters =
        q || validActive !== undefined
            ? {
                ...(q && { q }),
                ...(validActive !== undefined && { active: validActive }),
            }
            : undefined;
    const result = await getAllMenuTypesAction(filters);

    if (!result.success) {
        return <div>Error al obtener los menús</div>;
    }

    const menuTypes = result.data && result.data.length > 0 ? result.data : [];

    return <MenusTable menuTypes={menuTypes} q={q} active={active} />;
}
