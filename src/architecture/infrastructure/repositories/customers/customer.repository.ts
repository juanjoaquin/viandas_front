import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { ICustomerRepository } from "@/src/architecture/core/domain/repository/customer/i-customer.repository";
import { getHttpClient, HttpClient } from "../../http";
import { Result } from "@/src/libs/result";



export class CustomerRepository implements ICustomerRepository {
    constructor(private readonly httpClient: HttpClient = getHttpClient()) {}

    async getAll(accessToken: string): Promise<Result<TCustomer[]>> {
        return await this.httpClient.get<TCustomer[]>("customers", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            tags: ["customers"],
        });
    }
}