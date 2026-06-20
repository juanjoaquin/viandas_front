import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../../core/domain/repository/product-category/i-product-category.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteProductCategoryUseCase(
    repository: IProductCategoryRepository,
    id: string,
): Promise<Result<void>> {
    try {
        const result = await repository.delete(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-PRODUCT-CATEGORY] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-PRODUCT-CATEGORY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
