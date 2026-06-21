"use server";

import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ExtraProductController } from "../../controllers/extra-product.controller";
import { GetExtraProductsFilters } from "../../core/domain/extra-product/get-extra-products-filters";
import { TExtraProduct } from "../../core/domain/entities/ExtraProduct";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ExtraProductRepository } from "../../infrastructure/repositories/extra-product/extra-product.repository";

export async function getAllExtraProductsAction(
    filters?: GetExtraProductsFilters,
): Promise<Result<Paginated<TExtraProduct>>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-EXTRA-PRODUCTS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "get-all-extra-products",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ExtraProductRepository(httpClient);
        const controller = new ExtraProductController(repository);
        const result = await controller.getAllExtraProducts(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-EXTRA-PRODUCTS] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-ALL-EXTRA-PRODUCTS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
