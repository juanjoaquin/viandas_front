"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ProductCategoryController } from "../../controllers/product-category.controller";
import { TProductCategory } from "../../core/domain/entities/ProductCategory";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ProductCategoryRepository } from "../../infrastructure/repositories/product-category/product-category.repository";

export async function getProductCategoryByIdAction(
    productCategoryId: string,
): Promise<Result<TProductCategory>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-PRODUCT-CATEGORY-BY-ID] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = productCategoryId.trim();
    if (!id) {
        return Err("ID de categoría requerido", "VALIDATION");
    }

    setLogContext({
        operation: "get-product-category-by-id",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ProductCategoryRepository(httpClient);
        const controller = new ProductCategoryController(repository);
        const result = await controller.getProductCategoryById(id);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-PRODUCT-CATEGORY-BY-ID] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-PRODUCT-CATEGORY-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
