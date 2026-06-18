"use server";

import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { getAccessToken } from "@/src/libs/token";
import { Err, Result } from "@/src/libs/result";
import { CreateDeliveryInput, createDeliveryInputSchema } from "../../core/domain/entities/Delivery";
import { TDelivery } from "../../core/domain/entities/Delivery";
import { DeliveryController } from "../../controllers/delivery.controller";
import { DeliveryRepository } from "../../infrastructure/repositories/delivery/delivery.repository";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { updateTag } from "next/cache";


export async function createDeliveryAction(data: CreateDeliveryInput): Promise<Result<TDelivery>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-DELIVERY] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    //DEBUG CONTEXT
    setLogContext({ operation: "create-delivery", hasAccessToken: Boolean(accessToken) });

    const parsed = createDeliveryInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DeliveryRepository(httpClient);
        const controller = new DeliveryController(repository);
        const result = await controller.createDelivery(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-DELIVERY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag('deliveries')

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][CREATE-DELIVERY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}