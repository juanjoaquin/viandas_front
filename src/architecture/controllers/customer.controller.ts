import { Err, Result } from "@/src/libs/result";
import { getAllCustomersUseCase } from "../use-cases/customer/get-all-customers.use-case";
import { ICustomerRepository } from "../core/domain/repository/customer/i-customer.repository";
import { GetCustomersFilters } from "../core/domain/customer/get-customers-filters";
import { TCustomer } from "../core/domain/entities/Customer";
import { Logger } from "../infrastructure/logger/logger";

export class CustomerController {
    constructor(private readonly repository: ICustomerRepository) {}

    async getAllCustomers(
        accessToken: string,
        filters?: GetCustomersFilters,
    ): Promise<Result<TCustomer[]>> {
        try {
            const result = await getAllCustomersUseCase(
                this.repository,
                accessToken,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[CUSTOMER-CONTROLLER][GET-ALL-CUSTOMERS] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[CUSTOMER-CONTROLLER][GET-ALL-CUSTOMERS] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}