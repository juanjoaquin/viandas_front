import { Err, Result } from "@/src/libs/result";
import { TWeekMenu } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllWeekMenusUseCase(
    repository: IWeekMenuRepository,
): Promise<Result<TWeekMenu[]>> {
    try {
        const result = await repository.getAll();

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-WEEK-MENUS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-WEEK-MENUS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
