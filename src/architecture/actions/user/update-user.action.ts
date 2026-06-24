"use server";

import { updateTag } from "next/cache";
import {
    updateUserInputSchema,
    UpdateUserInput,
} from "../../core/domain/entities/User";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { UserRepository } from "../../infrastructure/repositories/user/user.repository";
import { UserController } from "../../controllers/user.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function updateUserAction(
    userId: string,
    data: UpdateUserInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-USER] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = userId.trim();
    if (!id) {
        return Err("ID de usuario requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-user",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateUserInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new UserRepository(httpClient);
        const controller = new UserController(repository);
        const result = await controller.updateUser(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-USER] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("users");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][UPDATE-USER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
