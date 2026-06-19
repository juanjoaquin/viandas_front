import { Err, Result } from "@/src/libs/result";
import { TDayMenu } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getMenuByDateUseCase(
    repository: IWeekMenuRepository,
    date: string,
): Promise<Result<TDayMenu>> {
    try {
        const result = await repository.getMenuByDate(date);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-MENU-BY-DATE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-MENU-BY-DATE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
