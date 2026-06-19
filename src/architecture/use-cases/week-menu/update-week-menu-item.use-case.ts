import { Err, Result } from "@/src/libs/result";
import { UpdateWeekMenuItemInput } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateWeekMenuItemUseCase(
    repository: IWeekMenuRepository,
    weekMenuId: string,
    itemId: string,
    data: UpdateWeekMenuItemInput,
): Promise<Result<void>> {
    try {
        const result = await repository.updateItem(weekMenuId, itemId, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-WEEK-MENU-ITEM] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-WEEK-MENU-ITEM] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
