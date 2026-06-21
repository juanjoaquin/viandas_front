import { CreateCustomerInput, TCustomer, UpdateCustomerInput } from "@/src/architecture/core/domain/entities/Customer";
import { GetCustomersFilters } from "@/src/architecture/core/domain/customer/get-customers-filters";
import { appendPaginationParams, Paginated } from "@/src/architecture/core/domain/pagination";
import { ICustomerRepository } from "@/src/architecture/core/domain/repository/customer/i-customer.repository";
import { HttpClient } from "../../http";
import { Result } from "@/src/libs/result";

export class CustomerRepository implements ICustomerRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(filters?: GetCustomersFilters): Promise<Result<Paginated<TCustomer>>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        if (filters?.type) params.set("type", filters.type);
        appendPaginationParams(params, filters);
        const qs = params.toString();
        const endpoint = qs ? `customers?${qs}` : "customers";

        console.log("[CustomerRepository] GET", endpoint);

        return await this.httpClient.getPaginated<TCustomer>(endpoint, {
            tags: ["customers"],
        });
    }

    async create(data: CreateCustomerInput): Promise<Result<TCustomer>> {
        return await this.httpClient.post<TCustomer>("customers", data);
    }

    async getById(id: string): Promise<Result<TCustomer>> {
        const params = new URLSearchParams({ customerId: id });

        return await this.httpClient.get<TCustomer>(`customers/one?${params.toString()}`, {
            tags: ["customers"],
        });
    }

    async update(id: string, data: UpdateCustomerInput): Promise<Result<void>> {
        return await this.httpClient.put<void>(`customers/${id}`, data);
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("customers", { id });
    }
}
