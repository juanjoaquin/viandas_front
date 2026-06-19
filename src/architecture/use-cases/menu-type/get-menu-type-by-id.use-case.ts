import { TMenuType } from "../../core/domain/entities/MenuType";
import { IMenuTypeRepository } from "../../core/domain/repository/menu-type/i-menu-type.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function getMenuTypeByIdUseCase(
    repository: IMenuTypeRepository,
    id: string,
): Promise<Result<TMenuType>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-MENU-TYPE-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-MENU-TYPE-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
