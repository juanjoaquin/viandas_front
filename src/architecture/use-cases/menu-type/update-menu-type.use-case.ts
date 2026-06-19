import { UpdateMenuTypeInput } from "../../core/domain/entities/MenuType";
import { IMenuTypeRepository } from "../../core/domain/repository/menu-type/i-menu-type.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateMenuTypeUseCase(
    repository: IMenuTypeRepository,
    id: string,
    data: UpdateMenuTypeInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-MENU-TYPE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-MENU-TYPE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
