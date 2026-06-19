"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { MenuTypeController } from "../../controllers/menu-type.controller";
import { GetMenuTypesFilters } from "../../core/domain/menu-type/get-menu-types-filters";
import { TMenuType } from "../../core/domain/entities/MenuType";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { MenuTypeRepository } from "../../infrastructure/repositories/menu-type/menu-type.repository";

export async function getAllMenuTypesAction(
    filters?: GetMenuTypesFilters,
): Promise<Result<TMenuType[]>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-MENU-TYPES] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "get-all-menu-types",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new MenuTypeRepository(httpClient);
        const controller = new MenuTypeController(repository);
        const result = await controller.getAllMenuTypes(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-MENU-TYPES] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-ALL-MENU-TYPES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
