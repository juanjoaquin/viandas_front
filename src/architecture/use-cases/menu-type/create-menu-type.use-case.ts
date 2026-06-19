import { Err, Result } from "@/src/libs/result";
import { IMenuTypeRepository } from "../../core/domain/repository/menu-type/i-menu-type.repository";
import { Logger } from "../../infrastructure/logger/logger";
import { CreateMenuTypeInput, TMenuType } from "../../core/domain/entities/MenuType";

export async function createMenuTypeUseCase(
    repository: IMenuTypeRepository,
    data: CreateMenuTypeInput,
): Promise<Result<TMenuType>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-MENU-TYPE] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-MENU-TYPE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
