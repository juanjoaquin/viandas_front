"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { WeekMenuRepository } from "../../infrastructure/repositories/week-menu/week-menu.repository";
import { WeekMenuController } from "../../controllers/week-menu.controller";

export async function deleteWeekMenuItemAction(
    weekMenuId: string,
    itemId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-WEEK-MENU-ITEM] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "delete-week-menu-item", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new WeekMenuRepository(httpClient);
        const controller = new WeekMenuController(repository);
        const result = await controller.deleteWeekMenuItem(weekMenuId, itemId);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-WEEK-MENU-ITEM] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("week-menus");

        return result;
    } catch (error) {
        Logger.error("[ACTION][DELETE-WEEK-MENU-ITEM] Unexpected error", error);

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
