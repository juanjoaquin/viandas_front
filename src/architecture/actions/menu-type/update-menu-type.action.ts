"use server";

import { updateTag } from "next/cache";
import {
    updateMenuTypeInputSchema,
    UpdateMenuTypeInput,
} from "../../core/domain/entities/MenuType";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { MenuTypeRepository } from "../../infrastructure/repositories/menu-type/menu-type.repository";
import { MenuTypeController } from "../../controllers/menu-type.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function updateMenuTypeAction(
    menuTypeId: string,
    data: UpdateMenuTypeInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-MENU-TYPE] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = menuTypeId.trim();
    if (!id) {
        return Err("ID de menú requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-menu-type",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateMenuTypeInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new MenuTypeRepository(httpClient);
        const controller = new MenuTypeController(repository);
        const result = await controller.updateMenuType(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-MENU-TYPE] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("menu-types");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][UPDATE-MENU-TYPE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
