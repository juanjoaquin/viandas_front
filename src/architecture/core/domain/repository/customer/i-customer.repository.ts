import { Result } from "@/src/libs/result";
import { Paginated } from "../../pagination";
import { CreateCustomerInput, TCustomer, UpdateCustomerInput } from "../../entities/Customer";
import { GetCustomersFilters } from "../../customer/get-customers-filters";

export interface ICustomerRepository {
    getAll(filters?: GetCustomersFilters): Promise<Result<Paginated<TCustomer>>>;
    create(data: CreateCustomerInput): Promise<Result<TCustomer>>;
    getById(id: string): Promise<Result<TCustomer>>;
    update(id: string, data: UpdateCustomerInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}