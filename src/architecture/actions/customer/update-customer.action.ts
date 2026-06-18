"use server";

import { updateTag } from "next/cache";
import {
    updateCustomerInputSchema,
    UpdateCustomerInput,
} from "../../core/domain/entities/Customer";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { CustomerRepository } from "../../infrastructure/repositories/customers/customer.repository";
import { CustomerController } from "../../controllers/customer.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function updateCustomerAction(
    customerId: string,
    data: UpdateCustomerInput,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][UPDATE-CUSTOMER] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    const id = customerId.trim();
    if (!id) {
        return Err("ID de cliente requerido", "VALIDATION");
    }

    setLogContext({
        operation: "update-customer",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = updateCustomerInputSchema.safeParse(data);
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "Datos inválidos",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new CustomerRepository(httpClient);
        const controller = new CustomerController(repository);
        const result = await controller.updateCustomer(id, parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][UPDATE-CUSTOMER] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("customers");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][UPDATE-CUSTOMER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
