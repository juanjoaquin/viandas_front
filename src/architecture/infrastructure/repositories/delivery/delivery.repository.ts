import { IDeliveryRepository } from "@/src/architecture/core/domain/repository/delivery/i-delivery.repository";
import { GetDeliveriesFilters } from "@/src/architecture/core/domain/delivery/get-deliveries-filters";
import { HttpClient } from "../../http";
import { CreateDeliveryInput, TDelivery, UpdateDeliveryInput } from "@/src/architecture/core/domain/entities/Delivery";
import { appendPaginationParams, Paginated } from "@/src/architecture/core/domain/pagination";
import { Result } from "@/src/libs/result";

export class DeliveryRepository implements IDeliveryRepository {
    constructor(private readonly httpClient: HttpClient) { }

    async getAll(filters?: GetDeliveriesFilters): Promise<Result<Paginated<TDelivery>>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        appendPaginationParams(params, filters);
        const qs = params.toString();
        const endpoint = qs ? `deliveries?${qs}` : "deliveries";

        return await this.httpClient.getPaginated<TDelivery>(endpoint, {
            tags: ["deliveries"],
        });
    }

    async getById(id: string): Promise<Result<TDelivery>> {
        const params = new URLSearchParams({ deliveryId: id });

        return await this.httpClient.get<TDelivery>(`deliveries/one?${params.toString()}`, {
            tags: ["deliveries", `delivery-${id}`],
        });
    }

    async create(data: CreateDeliveryInput): Promise<Result<TDelivery>> {
        return await this.httpClient.post<TDelivery>("deliveries", data);
    }

    async update(id: string, data: UpdateDeliveryInput): Promise<Result<void>> {
        return await this.httpClient.put<void>("deliveries", {
            id,
            name: data.name,
            phone: data.phone,
            active: data.active,
        });
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("deliveries", { id });
    }
}