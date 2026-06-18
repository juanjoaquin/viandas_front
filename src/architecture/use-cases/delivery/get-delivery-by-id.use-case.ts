import { Err, Result } from "@/src/libs/result";
import { IDeliveryRepository } from "../../core/domain/repository/delivery/i-delivery.repository";
import { TDelivery } from "../../core/domain/entities/Delivery";
import { Logger } from "../../infrastructure/logger/logger";


export async function getDeliveryByIdUseCase(id: string, repository: IDeliveryRepository): Promise<Result<TDelivery>> {

    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-DELIVERY-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }

    catch (error) {
        Logger.error(
            "[USE-CASE][GET-DELIVERY-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}