import { TCustomer } from "../../core/domain/entities/Customer";
import { ICustomerRepository } from "../../core/domain/repository/customer/i-customer.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function getCustomerByIdUseCase(
    repository: ICustomerRepository,
    id: string,
): Promise<Result<TCustomer>> {
    try {
        const result = await repository.getById(id);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][GET-CUSTOMER-BY-ID] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][GET-CUSTOMER-BY-ID] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
