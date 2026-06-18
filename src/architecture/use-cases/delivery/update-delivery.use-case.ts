import { UpdateDeliveryInput } from "../../core/domain/entities/Delivery";
import { IDeliveryRepository } from "../../core/domain/repository/delivery/i-delivery.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateDeliveryUseCase(
    repository: IDeliveryRepository,
    id: string,
    data: UpdateDeliveryInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-DELIVERY] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][UPDATE-DELIVERY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
