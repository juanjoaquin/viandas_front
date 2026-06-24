"use server";

import { UserController } from "../../controllers/user.controller";
import { UserRepository } from "../../infrastructure/repositories/user/user.repository";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { TUser } from "../../core/domain/entities/User";

export async function getUserByIdAction(id: string): Promise<Result<TUser>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-USER-BY-ID] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "get-user-by-id", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new UserRepository(httpClient);
        const controller = new UserController(repository);
        const result = await controller.getUserById(id);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-USER-BY-ID] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-USER-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
