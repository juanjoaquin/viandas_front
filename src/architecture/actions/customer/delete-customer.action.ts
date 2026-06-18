"use server";

import { updateTag } from "next/cache";
import { deleteCustomerInputSchema } from "../../core/domain/entities/Customer";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { CustomerRepository } from "../../infrastructure/repositories/customers/customer.repository";
import { CustomerController } from "../../controllers/customer.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function deleteCustomerAction(
    customerId: string,
): Promise<Result<void>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        Logger.error(
            "[ACTION][DELETE-CUSTOMER] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    setLogContext({
        operation: "delete-customer",
        hasAccessToken: Boolean(accessToken),
    });

    const parsed = deleteCustomerInputSchema.safeParse({ id: customerId.trim() });
    if (!parsed.success) {
        return Err(
            parsed.error.issues[0]?.message ?? "ID de cliente inválido",
            "VALIDATION",
        );
    }

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new CustomerRepository(httpClient);
        const controller = new CustomerController(repository);
        const result = await controller.deleteCustomer(parsed.data.id);

        if (!result.success) {
            Logger.error(
                "[ACTION][DELETE-CUSTOMER] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("customers");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][DELETE-CUSTOMER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
