"use server";

import { TCustomer } from "../../core/domain/entities/Customer";
import { GetCustomersFilters } from "../../core/domain/customer/get-customers-filters";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";
import { CustomerRepository } from "../../infrastructure/repositories/customers/customer.repository";
import { CustomerController } from "../../controllers/customer.controller";
import { getAccessToken } from "@/src/libs/token";

export async function getAllCustomersAction(
    filters?: GetCustomersFilters,
): Promise<Result<TCustomer[]>> {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return Err("No access token found", "UNAUTHORIZED");
    }

    try {
        const repository = new CustomerRepository();
        const controller = new CustomerController(repository);
        const result = await controller.getAllCustomers(accessToken, filters);

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