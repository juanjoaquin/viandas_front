"use server";

import { updateTag } from "next/cache";
import { deleteDeliveryInputSchema } from "../../core/domain/entities/Delivery";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { DeliveryRepository } from "../../infrastructure/repositories/delivery/delivery.repository";
import { DeliveryController } from "../../controllers/delivery.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function deleteDeliveryAction(
    deliveryId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-DELIVERY] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "delete-delivery",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = deleteDeliveryInputSchema.safeParse({ id: deliveryId.trim() });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de delivery inválido",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new DeliveryRepository(httpClient);
        const controller = new DeliveryController(repository);
        const result = await controller.deleteDelivery(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-DELIVERY] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("deliveries");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][DELETE-DELIVERY] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
