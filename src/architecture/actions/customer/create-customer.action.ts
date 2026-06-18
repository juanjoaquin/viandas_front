"use server";

import { updateTag } from "next/cache";
import {
    createCustomerInputSchema,
    CreateCustomerInput,
    TCustomer,
} from "../../core/domain/entities/Customer";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { CustomerRepository } from "../../infrastructure/repositories/customers/customer.repository";
import { CustomerController } from "../../controllers/customer.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function createCustomerAction(
    data: CreateCustomerInput,
): Promise<Result<TCustomer>> {
    const accessToken = await getAccessToken();

    
    if (!accessToken) {
        Logger.error(
            "[ACTION][CREATE-CUSTOMER] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }
    
    //DEBUG CONTEXT
    setLogContext({ operation: "create-customer", hasAccessToken: Boolean(accessToken) });

    const parsed = createCustomerInputSchema.safeParse(data);
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
        const result = await controller.createCustomer(parsed.data);

        if (!result.success) {
            Logger.error(
                "[ACTION][CREATE-CUSTOMER] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        updateTag("customers");

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][CREATE-CUSTOMER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
