import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { IDeliveryRepository } from "../core/domain/repository/delivery/i-delivery.repository";
import { GetDeliveriesFilters } from "../core/domain/delivery/get-deliveries-filters";
import { CreateDeliveryInput, TDelivery, UpdateDeliveryInput } from "../core/domain/entities/Delivery";
import { getAllDeliveriesUseCase } from "../use-cases/delivery/get-all-deliveries.use-case";
import { Logger } from "../infrastructure/logger/logger";
import { getDeliveryByIdUseCase } from "../use-cases/delivery/get-delivery-by-id.use-case";
import { createDeliveryUseCase } from "../use-cases/delivery/create-delivery.use-case";
import { updateDeliveryUseCase } from "../use-cases/delivery/update-delivery.use-case";
import { deleteDeliveryUseCase } from "../use-cases/delivery/delete-delivery.use-case";

export class DeliveryController {
    constructor(private readonly repository: IDeliveryRepository) {}

    async getAllDeliveries(
        filters?: GetDeliveriesFilters,
    ): Promise<Result<Paginated<TDelivery>>> {
        try {
            const result = await getAllDeliveriesUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[DELIVERY-CONTROLLER][GET-ALL-DELIVERIES] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[DELIVERY-CONTROLLER][GET-ALL-DELIVERIES] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getDeliveryById(id: string): Promise<Result<TDelivery>> {
        try {
            const result = await getDeliveryByIdUseCase(id, this.repository);

            if (!result.success) {
                Logger.error(
                    "[DELIVERY-CONTROLLER][GET-DELIVERY-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[DELIVERY-CONTROLLER][GET-DELIVERY-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createDelivery(data: CreateDeliveryInput): Promise<Result<TDelivery>> {
        try {
            const result = await createDeliveryUseCase(this.repository, data);

            if (!result.success) {
                Logger.error(
                    "[DELIVERY-CONTROLLER][CREATE-DELIVERY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[DELIVERY-CONTROLLER][CREATE-DELIVERY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateDelivery(
        id: string,
        data: UpdateDeliveryInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateDeliveryUseCase(
                this.repository,
                id,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[DELIVERY-CONTROLLER][UPDATE-DELIVERY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[DELIVERY-CONTROLLER][UPDATE-DELIVERY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteDelivery(id: string): Promise<Result<void>> {
        try {
            const result = await deleteDeliveryUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[DELIVERY-CONTROLLER][DELETE-DELIVERY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[DELIVERY-CONTROLLER][DELETE-DELIVERY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}