"use server";

import { Paginated } from "../../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { DeliveryController } from "../../controllers/delivery.controller";
import { GetDeliveriesFilters } from "../../core/domain/delivery/get-deliveries-filters";
import { TDelivery } from "../../core/domain/entities/Delivery";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DeliveryRepository } from "../../infrastructure/repositories/delivery/delivery.repository";

export async function getAllDeliveriesAction(
    filters?: GetDeliveriesFilters,
): Promise<Result<Paginated<TDelivery>>> {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-DELIVERIES] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    //DEBUG CONTEXT HTTP
    setLogContext({ operation: "get-all-deliveries", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DeliveryRepository(httpClient);
        const controller = new DeliveryController(repository);
        const result = await controller.getAllDeliveries(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-DELIVERIES] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][GET-ALL-DELIVERIES] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
