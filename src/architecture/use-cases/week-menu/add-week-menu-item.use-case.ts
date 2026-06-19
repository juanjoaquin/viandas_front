import { Err, Result } from "@/src/libs/result";
import { AddWeekMenuItemInput, TWeekMenuItem } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function addWeekMenuItemUseCase(
    repository: IWeekMenuRepository,
    weekMenuId: string,
    data: AddWeekMenuItemInput,
): Promise<Result<TWeekMenuItem>> {
    try {
        const result = await repository.addItem(weekMenuId, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][ADD-WEEK-MENU-ITEM] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][ADD-WEEK-MENU-ITEM] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
