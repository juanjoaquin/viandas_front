import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { TDelivery } from "../../core/domain/entities/Delivery";
import {
    GetDeliveriesFilters,
    normalizeGetDeliveriesFilters,
} from "../../core/domain/delivery/get-deliveries-filters";
import { IDeliveryRepository } from "../../core/domain/repository/delivery/i-delivery.repository";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllDeliveriesUseCase(repository: IDeliveryRepository, filters?: GetDeliveriesFilters): Promise<Result<Paginated<TDelivery>>> {
    try {
        const result = await repository.getAll(
            normalizeGetDeliveriesFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-DELIVERIES] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch (error) {
        Logger.error(
            "[USE-CASE][GET-ALL-DELIVERIES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}