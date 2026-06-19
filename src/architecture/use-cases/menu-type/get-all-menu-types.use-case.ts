import { Err, Result } from "@/src/libs/result";
import { TMenuType } from "../../core/domain/entities/MenuType";
import {
    GetMenuTypesFilters,
    normalizeGetMenuTypesFilters,
} from "../../core/domain/menu-type/get-menu-types-filters";
import { IMenuTypeRepository } from "../../core/domain/repository/menu-type/i-menu-type.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllMenuTypesUseCase(
    repository: IMenuTypeRepository,
    filters?: GetMenuTypesFilters,
): Promise<Result<TMenuType[]>> {
    try {
        const result = await repository.getAll(
            normalizeGetMenuTypesFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-MENU-TYPES] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-MENU-TYPES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
