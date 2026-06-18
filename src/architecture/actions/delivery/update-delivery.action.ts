"use server";

import { updateTag } from "next/cache";
import {
    updateDeliveryInputSchema,
    UpdateDeliveryInput,
} from "../../core/domain/entities/Delivery";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DeliveryRepository } from "../../infrastructure/repositories/delivery/delivery.repository";
import { DeliveryController } from "../../controllers/delivery.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function updateDeliveryAction(
    deliveryId: string,
    data: UpdateDeliveryInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-DELIVERY] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = deliveryId.trim();
    if (!id) {
        return Err("ID de delivery requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-delivery",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateDeliveryInputSchema.safeParse(data);
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
        const result = await controller.updateDelivery(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-DELIVERY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("deliveries");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][UPDATE-DELIVERY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
