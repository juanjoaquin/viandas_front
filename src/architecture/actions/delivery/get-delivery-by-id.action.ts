'use server';

import { DeliveryController } from "../../controllers/delivery.controller";
import { DeliveryRepository } from "../../infrastructure/repositories/delivery/delivery.repository";
import { Err, Result } from "@/src/libs/result";
import { getAccessToken } from "@/src/libs/token";
import { Logger } from "../../infrastructure/logger/logger";
import { setLogContext } from "../../infrastructure/logger/logger";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { TDelivery } from "../../core/domain/entities/Delivery";


export async function getDeliveryByIdAction(id: string): Promise<Result<TDelivery>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-DELIVERY-BY-ID] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
    }

    //DEBUG CONTEXT HTTP
    setLogContext({ operation: "get-delivery-by-id", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DeliveryRepository(httpClient);
        const controller = new DeliveryController(repository);
        const result = await controller.getDeliveryById(id);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-DELIVERY-BY-ID] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {  
        Logger.error(
            "[ACTION][GET-DELIVERY-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}