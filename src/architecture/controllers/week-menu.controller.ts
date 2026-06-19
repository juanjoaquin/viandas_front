import { Err, Result } from "@/src/libs/result";
import { IWeekMenuRepository } from "../core/domain/repository/week-menu/i-week-menu.repository";
import {
    AddWeekMenuItemInput,
    CreateWeekMenuInput,
    TDayMenu,
    TWeekMenu,
    TWeekMenuItem,
    UpdateWeekMenuItemInput,
} from "../core/domain/entities/WeekMenu";
import { Logger } from "../infrastructure/logger/logger";
import { getAllWeekMenusUseCase } from "../use-cases/week-menu/get-all-week-menus.use-case";
import { getWeekMenuByIdUseCase } from "../use-cases/week-menu/get-week-menu-by-id.use-case";
import { resolveWeekMenuUseCase } from "../use-cases/week-menu/resolve-week-menu.use-case";
import { getMenuByDateUseCase } from "../use-cases/week-menu/get-menu-by-date.use-case";
import { createWeekMenuUseCase } from "../use-cases/week-menu/create-week-menu.use-case";
import { addWeekMenuItemUseCase } from "../use-cases/week-menu/add-week-menu-item.use-case";
import { updateWeekMenuItemUseCase } from "../use-cases/week-menu/update-week-menu-item.use-case";
import { deleteWeekMenuUseCase } from "../use-cases/week-menu/delete-week-menu.use-case";
import { deleteWeekMenuItemUseCase } from "../use-cases/week-menu/delete-week-menu-item.use-case";

export class WeekMenuController {
    constructor(private readonly repository: IWeekMenuRepository) {}

    async getAllWeekMenus(): Promise<Result<TWeekMenu[]>> {
        try {
            const result = await getAllWeekMenusUseCase(this.repository);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][GET-ALL-WEEK-MENUS] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][GET-ALL-WEEK-MENUS] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getWeekMenuById(id: string): Promise<Result<TWeekMenu>> {
        try {
            const result = await getWeekMenuByIdUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][GET-WEEK-MENU-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][GET-WEEK-MENU-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async resolveWeekMenu(weekMenuId?: string): Promise<Result<TWeekMenu>> {
        try {
            const result = await resolveWeekMenuUseCase(this.repository, weekMenuId);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][RESOLVE-WEEK-MENU] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][RESOLVE-WEEK-MENU] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getMenuByDate(date: string): Promise<Result<TDayMenu>> {
        try {
            const result = await getMenuByDateUseCase(this.repository, date);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][GET-MENU-BY-DATE] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][GET-MENU-BY-DATE] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createWeekMenu(data: CreateWeekMenuInput): Promise<Result<TWeekMenu>> {
        try {
            const result = await createWeekMenuUseCase(this.repository, data);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][CREATE-WEEK-MENU] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][CREATE-WEEK-MENU] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async addWeekMenuItem(
        weekMenuId: string,
        data: AddWeekMenuItemInput,
    ): Promise<Result<TWeekMenuItem>> {
        try {
            const result = await addWeekMenuItemUseCase(this.repository, weekMenuId, data);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][ADD-WEEK-MENU-ITEM] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][ADD-WEEK-MENU-ITEM] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteWeekMenu(id: string): Promise<Result<void>> {
        try {
            const result = await deleteWeekMenuUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][DELETE-WEEK-MENU] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][DELETE-WEEK-MENU] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateWeekMenuItem(
        weekMenuId: string,
        itemId: string,
        data: UpdateWeekMenuItemInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateWeekMenuItemUseCase(
                this.repository,
                weekMenuId,
                itemId,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][UPDATE-WEEK-MENU-ITEM] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][UPDATE-WEEK-MENU-ITEM] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteWeekMenuItem(weekMenuId: string, itemId: string): Promise<Result<void>> {
        try {
            const result = await deleteWeekMenuItemUseCase(this.repository, weekMenuId, itemId);

            if (!result.success) {
                Logger.error(
                    "[WEEK-MENU-CONTROLLER][DELETE-WEEK-MENU-ITEM] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[WEEK-MENU-CONTROLLER][DELETE-WEEK-MENU-ITEM] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
