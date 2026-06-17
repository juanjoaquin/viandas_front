import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { GetCustomersFilters } from "@/src/architecture/core/domain/customer/get-customers-filters";
import { ICustomerRepository } from "@/src/architecture/core/domain/repository/customer/i-customer.repository";
import { getHttpClient, HttpClient } from "../../http";
import { Result } from "@/src/libs/result";

export class CustomerRepository implements ICustomerRepository {
    constructor(private readonly httpClient: HttpClient = getHttpClient()) {}

    async getAll(
        accessToken: string,
        filters?: GetCustomersFilters,
    ): Promise<Result<TCustomer[]>> {
        const endpoint = filters?.q
            ? `customers?q=${encodeURIComponent(filters.q)}`
            : "customers";

        return await this.httpClient.get<TCustomer[]>(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            tags: ["customers"],
        });
    }
}