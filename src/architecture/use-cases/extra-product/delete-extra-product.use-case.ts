import { Err, Result } from "@/src/libs/result";
import { IExtraProductRepository } from "../../core/domain/repository/extra-product/i-extra-product.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function deleteExtraProductUseCase(
    repository: IExtraProductRepository,
    id: string,
): Promise<Result<void>> {
    try {
        const result = await repository.delete(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][DELETE-EXTRA-PRODUCT] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    } catch (error) {
        Logger.error(
            "[USE-CASE][DELETE-EXTRA-PRODUCT] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
