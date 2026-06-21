import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { IMenuTypeRepository } from "../core/domain/repository/menu-type/i-menu-type.repository";
import {
    CreateMenuTypeInput,
    TMenuType,
    UpdateMenuTypeInput,
} from "../core/domain/entities/MenuType";
import { GetMenuTypesFilters } from "../core/domain/menu-type/get-menu-types-filters";
import { getAllMenuTypesUseCase } from "../use-cases/menu-type/get-all-menu-types.use-case";
import { Logger } from "../infrastructure/logger/logger";
import { createMenuTypeUseCase } from "../use-cases/menu-type/create-menu-type.use-case";
import { getMenuTypeByIdUseCase } from "../use-cases/menu-type/get-menu-type-by-id.use-case";
import { updateMenuTypeUseCase } from "../use-cases/menu-type/update-menu-type.use-case";
import { deleteMenuTypeUseCase } from "../use-cases/menu-type/delete-menu-type.use-case";

export class MenuTypeController {
    constructor(private readonly repository: IMenuTypeRepository) {}

    async getAllMenuTypes(
        filters?: GetMenuTypesFilters,
    ): Promise<Result<Paginated<TMenuType>>> {
        try {
            const result = await getAllMenuTypesUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[MENU-TYPE-CONTROLLER][GET-ALL-MENU-TYPES] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[MENU-TYPE-CONTROLLER][GET-ALL-MENU-TYPES] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createMenuType(data: CreateMenuTypeInput): Promise<Result<TMenuType>> {
        try {
            const result = await createMenuTypeUseCase(this.repository, data);

            if (!result.success) {
                Logger.error(
                    "[MENU-TYPE-CONTROLLER][CREATE-MENU-TYPE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[MENU-TYPE-CONTROLLER][CREATE-MENU-TYPE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getMenuTypeById(id: string): Promise<Result<TMenuType>> {
        try {
            const result = await getMenuTypeByIdUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[MENU-TYPE-CONTROLLER][GET-MENU-TYPE-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[MENU-TYPE-CONTROLLER][GET-MENU-TYPE-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateMenuType(
        id: string,
        data: UpdateMenuTypeInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateMenuTypeUseCase(this.repository, id, data);

            if (!result.success) {
                Logger.error(
                    "[MENU-TYPE-CONTROLLER][UPDATE-MENU-TYPE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[MENU-TYPE-CONTROLLER][UPDATE-MENU-TYPE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteMenuType(id: string): Promise<Result<void>> {
        try {
            const result = await deleteMenuTypeUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[MENU-TYPE-CONTROLLER][DELETE-MENU-TYPE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[MENU-TYPE-CONTROLLER][DELETE-MENU-TYPE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
