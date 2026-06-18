import { Err, Result } from "@/src/libs/result";
import { IDeliveryRepository } from "../../core/domain/repository/delivery/i-delivery.repository";
import { Logger } from "../../infrastructure/logger/logger";
import { CreateDeliveryInput } from "../../core/domain/entities/Delivery";
import { TDelivery } from "../../core/domain/entities/Delivery";


export async function createDeliveryUseCase(repository: IDeliveryRepository, data: CreateDeliveryInput): Promise<Result<TDelivery>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-DELIVERY] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][CREATE-DELIVERY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}