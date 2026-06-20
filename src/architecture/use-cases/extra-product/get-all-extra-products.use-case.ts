import { Err, Result } from "@/src/libs/result";
import { TExtraProduct } from "../../core/domain/entities/ExtraProduct";
import {
    GetExtraProductsFilters,
    normalizeGetExtraProductsFilters,
} from "../../core/domain/extra-product/get-extra-products-filters";
import { IExtraProductRepository } from "../../core/domain/repository/extra-product/i-extra-product.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllExtraProductsUseCase(
    repository: IExtraProductRepository,
    filters?: GetExtraProductsFilters,
): Promise<Result<TExtraProduct[]>> {
    try {
        const result = await repository.getAll(
            normalizeGetExtraProductsFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-EXTRA-PRODUCTS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-EXTRA-PRODUCTS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
