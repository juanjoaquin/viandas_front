import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../../core/domain/repository/product-category/i-product-category.repository";
import { TProductCategory } from "../../core/domain/entities/ProductCategory";
import { Logger } from "../../infrastructure/logger/logger";

export async function getProductCategoryByIdUseCase(
    repository: IProductCategoryRepository,
    id: string,
): Promise<Result<TProductCategory>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-PRODUCT-CATEGORY-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-PRODUCT-CATEGORY-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
