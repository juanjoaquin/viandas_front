import { Err, Result } from "@/src/libs/result";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteWeekMenuItemUseCase(
    repository: IWeekMenuRepository,
    weekMenuId: string,
    itemId: string,
): Promise<Result<void>> {
    try {
        const result = await repository.deleteItem(weekMenuId, itemId);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-WEEK-MENU-ITEM] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-WEEK-MENU-ITEM] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
