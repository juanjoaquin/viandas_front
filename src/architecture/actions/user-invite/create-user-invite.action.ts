"use server";

import { Err, type Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import {
  createUserInviteInputSchema,
  type CreateUserInviteInput,
  type TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";
import { UserInviteController } from "@/src/architecture/controllers/user-invite.controller";
import { createHttpClient } from "@/src/architecture/infrastructure/http/api-config";
import { UserInviteRepository } from "@/src/architecture/infrastructure/repositories/user-invite/user-invite.repository";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";

export async function createUserInviteAction(
  data: CreateUserInviteInput,
): Promise<Result<TUserInvite>> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    Logger.error(
      "[ACTION][CREATE-USER-INVITE] Unauthorized — no access token",
      { error: "No access token found", code: "UNAUTHORIZED" },
    );
    return Err("No access token found", "UNAUTHORIZED");
  }

  setLogContext({
    operation: "create-user-invite",
    hasAccessToken: Boolean(accessToken),
  });

  const parsed = createUserInviteInputSchema.safeParse(data);
  if (!parsed.success) {
    return Err(
      parsed.error.issues[0]?.message ?? "Datos inválidos",
      "VALIDATION",
    );
  }

  try {
    const httpClient = createHttpClient(() => accessToken);
    const repository = new UserInviteRepository(httpClient);
    const controller = new UserInviteController(repository);
    const result = await controller.createInvite(parsed.data);

    if (!result.success) {
      Logger.error(
        "[ACTION][CREATE-USER-INVITE] Action returned error",
        { error: result.error, code: result.code },
      );
    }

    return result;
  } catch (error) {
    Logger.error(
      "[ACTION][CREATE-USER-INVITE] Unexpected error",
      error,
    );

    return Err(
      error instanceof Error ? error.message : "Error desconocido",
      "UNKNOWN",
    );
  }
}
