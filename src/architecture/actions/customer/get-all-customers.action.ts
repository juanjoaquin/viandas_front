"use server";

import { TCustomer } from "../../core/domain/entities/Customer";
import { GetCustomersFilters } from "../../core/domain/customer/get-customers-filters";
import { Err, Result } from "@/src/libs/result";
import { Logger, setLogContext } from "../../infrastructure/logger/logger";
import { CustomerRepository } from "../../infrastructure/repositories/customers/customer.repository";
import { CustomerController } from "../../controllers/customer.controller";
import { createHttpClient } from "../../infrastructure/http/api-config";
import { getAccessToken } from "@/src/libs/token";

export async function getAllCustomersAction(filters?: GetCustomersFilters): Promise<Result<TCustomer[]>> {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        Logger.error(
            "[ACTION][GET-ALL-CUSTOMERS] Unauthorized — no access token",
            { error: "No access token found", code: "UNAUTHORIZED" },
        );
        return Err("No access token found", "UNAUTHORIZED");
    }

    //DEBUG CONTEXT HTTP
    setLogContext({ operation: "get-all-customers", hasAccessToken: Boolean(accessToken) });

    try {
        const httpClient = createHttpClient(() => accessToken);
        const repository = new CustomerRepository(httpClient);
        const controller = new CustomerController(repository);
        const result = await controller.getAllCustomers(filters);

        if (!result.success) {
            Logger.error(
                "[ACTION][GET-ALL-CUSTOMERS] Action returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[ACTION][GET-ALL-CUSTOMERS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
