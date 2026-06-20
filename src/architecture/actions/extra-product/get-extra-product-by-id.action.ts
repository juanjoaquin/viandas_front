"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ExtraProductController } from "../../controllers/extra-product.controller";
import { TExtraProduct } from "../../core/domain/entities/ExtraProduct";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ExtraProductRepository } from "../../infrastructure/repositories/extra-product/extra-product.repository";

export async function getExtraProductByIdAction(
    extraProductId: string,
): Promise<Result<TExtraProduct>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-EXTRA-PRODUCT-BY-ID] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = extraProductId.trim();
    if (!id) {
        return Err("ID de producto requerido", "VALIDATION");
    }

    setLogContext({
        operation: "get-extra-product-by-id",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ExtraProductRepository(httpClient);
        const controller = new ExtraProductController(repository);
        const result = await controller.getExtraProductById(id);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-EXTRA-PRODUCT-BY-ID] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-EXTRA-PRODUCT-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
