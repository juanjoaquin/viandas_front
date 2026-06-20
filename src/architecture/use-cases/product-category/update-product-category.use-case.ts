import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../../core/domain/repository/product-category/i-product-category.repository";
import { UpdateProductCategoryInput } from "../../core/domain/entities/ProductCategory";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateProductCategoryUseCase(
    repository: IProductCategoryRepository,
    id: string,
    data: UpdateProductCategoryInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-PRODUCT-CATEGORY] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
