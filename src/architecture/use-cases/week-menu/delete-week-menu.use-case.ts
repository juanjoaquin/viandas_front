import { Err, Result } from "@/src/libs/result";
import { IWeekMenuRepository } from "../../core/domain/repository/week-menu/i-week-menu.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteWeekMenuUseCase(
    repository: IWeekMenuRepository,
    id: string,
): Promise<Result<void>> {
    try {
        const result = await repository.delete(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-WEEK-MENU] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-WEEK-MENU] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
