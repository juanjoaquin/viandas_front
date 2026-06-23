import { resolveWeekMenuAction } from "@/src/architecture/actions/week-menu/resolve-week-menu.action";
import { getAllMenuTypesAction } from "@/src/architecture/actions/menu-type/get-all-menu-types.action";
import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";
import { TWeekMenu } from "@/src/architecture/core/domain/entities/WeekMenu";
import { WeekMenuGrid } from "./week-menu-grid";

type WeekMenuGridDataProps = {
    requestedWeekMenuId?: string;
    allMenus: TWeekMenu[];
};

export async function WeekMenuGridData({
    requestedWeekMenuId,
    allMenus,
}: WeekMenuGridDataProps) {
    if (!allMenus.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                    No hay menús semanales configurados
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Creá la primera semana usando el botón de arriba.
                </p>
            </div>
        );
    }

    const [weekMenuResult, menuTypesResult] = await Promise.all([
        resolveWeekMenuAction(requestedWeekMenuId),
        getAllMenuTypesAction({ active: true, page: 1, limit: DEFAULT_PAGE_LIMIT }),
    ]);

    if (!weekMenuResult.success) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <p className="text-sm font-medium text-destructive">
                    Error al cargar el menú semanal
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {weekMenuResult.error}
                </p>
            </div>
        );
    }

    const weekMenu = weekMenuResult.data!;
    const menuTypes = menuTypesResult.success ? (menuTypesResult.data?.items ?? []) : [];

    return (
        <WeekMenuGrid
            weekMenu={weekMenu}
            menuTypes={menuTypes}
            allMenus={allMenus}
        />
    );
}
