import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../../core/domain/repository/product-category/i-product-category.repository";
import {
    CreateProductCategoryInput,
    TProductCategory,
} from "../../core/domain/entities/ProductCategory";
import { Logger } from "../../infrastructure/logger/logger";

export async function createProductCategoryUseCase(
    repository: IProductCategoryRepository,
    data: CreateProductCategoryInput,
): Promise<Result<TProductCategory>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-PRODUCT-CATEGORY] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
