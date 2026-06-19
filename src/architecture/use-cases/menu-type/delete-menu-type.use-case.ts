import { IMenuTypeRepository } from "../../core/domain/repository/menu-type/i-menu-type.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteMenuTypeUseCase(
    repository: IMenuTypeRepository,
    id: string,
): Promise<Result<void>> {
    try {
        const result = await repository.delete(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-MENU-TYPE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-MENU-TYPE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
