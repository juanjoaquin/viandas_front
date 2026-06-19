"use server";

import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { getAccessToken } from "@/src/libs/token";
import { Err, Result } from "@/src/libs/result";
import {
    CreateMenuTypeInput,
    createMenuTypeInputSchema,
    TMenuType,
} from "../../core/domain/entities/MenuType";
import { MenuTypeController } from "../../controllers/menu-type.controller";
import { MenuTypeRepository } from "../../infrastructure/repositories/menu-type/menu-type.repository";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { updateTag } from "next/cache";

export async function createMenuTypeAction(
    data: CreateMenuTypeInput,
): Promise<Result<TMenuType>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-MENU-TYPE] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "create-menu-type",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = createMenuTypeInputSchema.safeParse(data);
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
        const result = await controller.createMenuType(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-MENU-TYPE] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("menu-types");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][CREATE-MENU-TYPE] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
