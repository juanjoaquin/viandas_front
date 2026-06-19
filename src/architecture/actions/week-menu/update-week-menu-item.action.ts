"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import {
    UpdateWeekMenuItemInput,
    updateWeekMenuItemInputSchema,
} from "../../core/domain/entities/WeekMenu";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { WeekMenuRepository } from "../../infrastructure/repositories/week-menu/week-menu.repository";
import { WeekMenuController } from "../../controllers/week-menu.controller";

export async function updateWeekMenuItemAction(
    weekMenuId: string,
    itemId: string,
    data: UpdateWeekMenuItemInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-WEEK-MENU-ITEM] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "update-week-menu-item", hasAccessToken: Boolean(accessToken) });

    const parsed = updateWeekMenuItemInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new WeekMenuRepository(httpClient);
        const controller = new WeekMenuController(repository);
        const result = await controller.updateWeekMenuItem(weekMenuId, itemId, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-WEEK-MENU-ITEM] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("week-menus");

        return result;
    } catch (error) {
        Logger.error("[ACTION][UPDATE-WEEK-MENU-ITEM] Unexpected error", error);

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
