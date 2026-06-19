import { getAllDishesAction } from "@/src/architecture/actions/dish/get-all-dishes.action";
import { getAllMenuTypesAction } from "@/src/architecture/actions/menu-type/get-all-menu-types.action";
import { DishesTable } from "./dishes-table";

type DishesTableDataProps = {
    q?: string;
    menuTypeId?: string;
};

export async function DishesTableData({ q, menuTypeId }: DishesTableDataProps) {
    const filters =
        q || menuTypeId
            ? {
                  ...(q && { q }),
                  ...(menuTypeId && { menu_type_id: menuTypeId }),
              }
            : undefined;
    const [result, menuTypesResult] = await Promise.all([
        getAllDishesAction(filters),
        getAllMenuTypesAction(),
    ]);

    if (!result.success) {
        return <div>Error al obtener los platos</div>;
    }

    const dishes = result.data ?? [];
    const menuTypes = menuTypesResult.success ? (menuTypesResult.data ?? []) : [];

    return (
        <DishesTable
            dishes={dishes}
            menuTypes={menuTypes}
            q={q}
            menuTypeId={menuTypeId}
        />
    );
}
