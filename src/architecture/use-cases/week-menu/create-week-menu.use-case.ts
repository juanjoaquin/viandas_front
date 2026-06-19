import { Err, Result } from "@/src/libs/result";
import { CreateWeekMenuInput, TWeekMenu } from "../../core/domain/entities/WeekMenu";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function createWeekMenuUseCase(
    repository: IWeekMenuRepository,
    data: CreateWeekMenuInput,
): Promise<Result<TWeekMenu>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-WEEK-MENU] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-WEEK-MENU] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
