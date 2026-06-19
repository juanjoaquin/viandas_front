"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { TWeekMenu } from "../../core/domain/entities/WeekMenu";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { WeekMenuRepository } from "../../infrastructure/repositories/week-menu/week-menu.repository";
import { WeekMenuController } from "../../controllers/week-menu.controller";

export async function getAllWeekMenusAction(): Promise<Result<TWeekMenu[]>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-WEEK-MENUS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "get-all-week-menus", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new WeekMenuRepository(httpClient);
        const controller = new WeekMenuController(repository);
        const result = await controller.getAllWeekMenus();

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-WEEK-MENUS] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error("[ACTION][GET-ALL-WEEK-MENUS] Unexpected error", error);

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
