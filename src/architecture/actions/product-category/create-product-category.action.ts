"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ProductCategoryController } from "../../controllers/product-category.controller";
import {
    CreateProductCategoryInput,
    createProductCategoryInputSchema,
    TProductCategory,
} from "../../core/domain/entities/ProductCategory";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ProductCategoryRepository } from "../../infrastructure/repositories/product-category/product-category.repository";

export async function createProductCategoryAction(
    data: CreateProductCategoryInput,
): Promise<Result<TProductCategory>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-PRODUCT-CATEGORY] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "create-product-category",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = createProductCategoryInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ProductCategoryRepository(httpClient);
        const controller = new ProductCategoryController(repository);
        const result = await controller.createProductCategory(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-PRODUCT-CATEGORY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("product-categories");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][CREATE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
