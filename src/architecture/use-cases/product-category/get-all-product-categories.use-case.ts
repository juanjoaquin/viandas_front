import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../../core/domain/repository/product-category/i-product-category.repository";
import { TProductCategory } from "../../core/domain/entities/ProductCategory";
import {
    GetProductCategoriesFilters,
    normalizeGetProductCategoriesFilters,
} from "../../core/domain/product-category/get-product-categories-filters";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllProductCategoriesUseCase(
    repository: IProductCategoryRepository,
    filters?: GetProductCategoriesFilters,
): Promise<Result<TProductCategory[]>> {
    try {
        const result = await repository.getAll(
            normalizeGetProductCategoriesFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-PRODUCT-CATEGORIES] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-PRODUCT-CATEGORIES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
