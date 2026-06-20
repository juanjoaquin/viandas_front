import { Err, Result } from "@/src/libs/result";
import { TExtraProduct } from "../../core/domain/entities/ExtraProduct";
import { IExtraProductRepository } from "../../core/domain/repository/extra-product/i-extra-product.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getExtraProductByIdUseCase(
    repository: IExtraProductRepository,
    id: string,
): Promise<Result<TExtraProduct>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-EXTRA-PRODUCT-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][GET-EXTRA-PRODUCT-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
