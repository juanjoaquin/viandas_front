import { CreateCustomerInput, TCustomer } from "../../core/domain/entities/Customer";
import { ICustomerRepository } from "../../core/domain/repository/customer/i-customer.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function createCustomerUseCase(
    repository: ICustomerRepository,
    data: CreateCustomerInput,
): Promise<Result<TCustomer>> {
    try {
        const result = await repository.create(data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][CREATE-CUSTOMER] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][CREATE-CUSTOMER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
