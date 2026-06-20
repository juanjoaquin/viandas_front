"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ProductCategoryController } from "../../controllers/product-category.controller";
import {
    UpdateProductCategoryInput,
    updateProductCategoryInputSchema,
} from "../../core/domain/entities/ProductCategory";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ProductCategoryRepository } from "../../infrastructure/repositories/product-category/product-category.repository";

export async function updateProductCategoryAction(
    productCategoryId: string,
    data: UpdateProductCategoryInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-PRODUCT-CATEGORY] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = productCategoryId.trim();
    if (!id) {
        return Err("ID de categoría requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-product-category",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateProductCategoryInputSchema.safeParse(data);
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
        const result = await controller.updateProductCategory(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-PRODUCT-CATEGORY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("product-categories");
        updateTag(`product-category-${id}`);

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][UPDATE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
