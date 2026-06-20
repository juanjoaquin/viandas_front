"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ExtraProductController } from "../../controllers/extra-product.controller";
import {
    UpdateExtraProductInput,
    updateExtraProductInputSchema,
} from "../../core/domain/entities/ExtraProduct";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ExtraProductRepository } from "../../infrastructure/repositories/extra-product/extra-product.repository";

export async function updateExtraProductAction(
    extraProductId: string,
    data: UpdateExtraProductInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-EXTRA-PRODUCT] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = extraProductId.trim();
    if (!id) {
        return Err("ID de producto requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-extra-product",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateExtraProductInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ExtraProductRepository(httpClient);
        const controller = new ExtraProductController(repository);
        const result = await controller.updateExtraProduct(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-EXTRA-PRODUCT] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("extra-products");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][UPDATE-EXTRA-PRODUCT] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
