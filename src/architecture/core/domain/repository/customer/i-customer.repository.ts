import { Result } from "@/src/libs/result";
import { TCustomer } from "../../entities/Customer";
import { GetCustomersFilters } from "../../customer/get-customers-filters";

export interface ICustomerRepository {
    getAll(
        accessToken: string,
        filters?: GetCustomersFilters,
    ): Promise<Result<TCustomer[]>>;
}