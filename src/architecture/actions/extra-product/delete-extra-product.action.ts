"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ExtraProductController } from "../../controllers/extra-product.controller";
import { deleteExtraProductInputSchema } from "../../core/domain/entities/ExtraProduct";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ExtraProductRepository } from "../../infrastructure/repositories/extra-product/extra-product.repository";

export async function deleteExtraProductAction(
    extraProductId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-EXTRA-PRODUCT] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "delete-extra-product",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = deleteExtraProductInputSchema.safeParse({
        id: extraProductId.trim(),
    });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de producto inválido",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ExtraProductRepository(httpClient);
        const controller = new ExtraProductController(repository);
        const result = await controller.deleteExtraProduct(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-EXTRA-PRODUCT] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("extra-products");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][DELETE-EXTRA-PRODUCT] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
