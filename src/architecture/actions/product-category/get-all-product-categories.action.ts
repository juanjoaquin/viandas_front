"use server";

import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ProductCategoryController } from "../../controllers/product-category.controller";
import { GetProductCategoriesFilters } from "../../core/domain/product-category/get-product-categories-filters";
import { TProductCategory } from "../../core/domain/entities/ProductCategory";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ProductCategoryRepository } from "../../infrastructure/repositories/product-category/product-category.repository";

export async function getAllProductCategoriesAction(
    filters?: GetProductCategoriesFilters,
): Promise<Result<TProductCategory[]>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-PRODUCT-CATEGORIES] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "get-all-product-categories",
        hasAccessToken: Boolean(accessToken),
    });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ProductCategoryRepository(httpClient);
        const controller = new ProductCategoryController(repository);
        const result = await controller.getAllProductCategories(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-PRODUCT-CATEGORIES] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][GET-ALL-PRODUCT-CATEGORIES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
