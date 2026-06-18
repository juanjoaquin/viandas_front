import { UpdateCustomerInput } from "../../core/domain/entities/Customer";
import { ICustomerRepository } from "../../core/domain/repository/customer/i-customer.repository";
import { Err, Result } from "@/src/libs/result";
import { Logger } from "../../infrastructure/logger/logger";

export async function updateCustomerUseCase(
    repository: ICustomerRepository,
    id: string,
    data: UpdateCustomerInput,
): Promise<Result<void>> {
    try {
        const result = await repository.update(id, data);

        if (!result.success) {
            Logger.error(
                "[USE-CASE][UPDATE-CUSTOMER] Use case returned error",
                { error: result.error, code: result.code },
            );
        }

        return result;
    }
    catch(error) {
        Logger.error(
            "[USE-CASE][UPDATE-CUSTOMER] Unexpected error",
            error,
        );

        return Err(
            error instanceof Error ? error.message : "Error desconocido",
            "UNKNOWN",
        );
    }
}
