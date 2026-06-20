import { Err, Result } from "@/src/libs/result";
import { UpdateExtraProductInput } from "../../core/domain/entities/ExtraProduct";
import { IExtraProductRepository } from "../../core/domain/repository/extra-product/i-extra-product.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateExtraProductUseCase(
    repository: IExtraProductRepository,
    id: string,
    data: UpdateExtraProductInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-EXTRA-PRODUCT] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][UPDATE-EXTRA-PRODUCT] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
