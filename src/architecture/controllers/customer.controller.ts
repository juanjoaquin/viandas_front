import { Err, Result } from "@/src/libs/result";
import { getAllCustomersUseCase } from "../use-cases/customer/get-all-customers.use-case";
import { getCustomerByIdUseCase } from "../use-cases/customer/get-customer-by-id.use-case";
import { createCustomerUseCase } from "../use-cases/customer/create-customer.use-case";
import { updateCustomerUseCase } from "../use-cases/customer/update-customer.use-case";
import { deleteCustomerUseCase } from "../use-cases/customer/delete-customer.use-case";
import { ICustomerRepository } from "../core/domain/repository/customer/i-customer.repository";
import { GetCustomersFilters } from "../core/domain/customer/get-customers-filters";
import { Paginated } from "../core/domain/pagination";
import { CreateCustomerInput, TCustomer, UpdateCustomerInput } from "../core/domain/entities/Customer";
import { Logger } from "../infrastructure/logger/logger";

export class CustomerController {
    constructor(private readonly repository: ICustomerRepository) {}

    async getAllCustomers(
        filters?: GetCustomersFilters,
    ): Promise<Result<Paginated<TCustomer>>> {
        try {
            const result = await getAllCustomersUseCase(
                this.repository,
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

    async getCustomerById(id: string): Promise<Result<TCustomer>> {
        try {
            const result = await getCustomerByIdUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[CUSTOMER-CONTROLLER][GET-CUSTOMER-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[CUSTOMER-CONTROLLER][GET-CUSTOMER-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createCustomer(
        data: CreateCustomerInput,
    ): Promise<Result<TCustomer>> {
        try {
            const result = await createCustomerUseCase(
                this.repository,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[CUSTOMER-CONTROLLER][CREATE-CUSTOMER] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[CUSTOMER-CONTROLLER][CREATE-CUSTOMER] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateCustomer(
        id: string,
        data: UpdateCustomerInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateCustomerUseCase(
                this.repository,
                id,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[CUSTOMER-CONTROLLER][UPDATE-CUSTOMER] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[CUSTOMER-CONTROLLER][UPDATE-CUSTOMER] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteCustomer(id: string): Promise<Result<void>> {
        try {
            const result = await deleteCustomerUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[CUSTOMER-CONTROLLER][DELETE-CUSTOMER] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        }
        catch(error) {
            Logger.error(
                "[CUSTOMER-CONTROLLER][DELETE-CUSTOMER] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}