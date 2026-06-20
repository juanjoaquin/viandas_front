import { Err, Result } from "@/src/libs/result";
import {
    CreateExtraProductInput,
    TExtraProduct,
} from "../../core/domain/entities/ExtraProduct";
import { IExtraProductRepository } from "../../core/domain/repository/extra-product/i-extra-product.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function createExtraProductUseCase(
    repository: IExtraProductRepository,
    data: CreateExtraProductInput,
): Promise<Result<TExtraProduct>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-EXTRA-PRODUCT] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][CREATE-EXTRA-PRODUCT] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
