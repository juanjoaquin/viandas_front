import { Err, Result } from "@/src/libs/result";
import { TWeekMenu } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function resolveWeekMenuUseCase(
    repository: IWeekMenuRepository,
    weekMenuId?: string,
): Promise<Result<TWeekMenu>> {
    try {
        const result = await repository.resolve(weekMenuId);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][RESOLVE-WEEK-MENU] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][RESOLVE-WEEK-MENU] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
