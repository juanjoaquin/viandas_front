"use server";

import { updateTag } from "next/cache";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { ProductCategoryController } from "../../controllers/product-category.controller";
import { deleteProductCategoryInputSchema } from "../../core/domain/entities/ProductCategory";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { ProductCategoryRepository } from "../../infrastructure/repositories/product-category/product-category.repository";

export async function deleteProductCategoryAction(
    productCategoryId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-PRODUCT-CATEGORY] Unauthorized - no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "delete-product-category",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = deleteProductCategoryInputSchema.safeParse({
        id: productCategoryId.trim(),
    });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de categoría inválido",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new ProductCategoryRepository(httpClient);
        const controller = new ProductCategoryController(repository);
        const result = await controller.deleteProductCategory(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-PRODUCT-CATEGORY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("product-categories");

        return result;
    } catch (error) {
        Logger.error(
            "[ACTION][DELETE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
