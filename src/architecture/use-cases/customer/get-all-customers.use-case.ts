import { TCustomer } from "../../core/domain/entities/Customer";
import {
    GetCustomersFilters,
    normalizeGetCustomersFilters,
} from "../../core/domain/customer/get-customers-filters";
import { ICustomerRepository } from "../../core/domain/repository/customer/i-customer.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function getAllCustomersUseCase(
    repository: ICustomerRepository,
    filters?: GetCustomersFilters,
): Promise<Result<TCustomer[]>> {
    try {
        const result = await repository.getAll(
            normalizeGetCustomersFilters(filters),
        );

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-ALL-CUSTOMERS] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][GET-ALL-CUSTOMERS] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}