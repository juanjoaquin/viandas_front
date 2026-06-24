"use server";

import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { UserController } from "../../controllers/user.controller";
import { GetUsersFilters } from "../../core/domain/user/get-users-filters";
import { TUser } from "../../core/domain/entities/User";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { UserRepository } from "../../infrastructure/repositories/user/user.repository";

export async function getAllUsersAction(
    filters?: GetUsersFilters,
): Promise<Result<Paginated<TUser>>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-USERS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({ operation: "get-all-users", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new UserRepository(httpClient);
        const controller = new UserController(repository);
        const result = await controller.getAllUsers(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-USERS] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-ALL-USERS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
