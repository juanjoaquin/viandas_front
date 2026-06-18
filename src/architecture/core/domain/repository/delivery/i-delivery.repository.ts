import { Result } from "@/src/libs/result";
import { CreateDeliveryInput, TDelivery, UpdateDeliveryInput } from "../../entities/Delivery";
import { GetDeliveriesFilters } from "../../delivery/get-deliveries-filters";

export interface IDeliveryRepository {
    getAll(filters?: GetDeliveriesFilters): Promise<Result<TDelivery[]>>;
    getById(id: string): Promise<Result<TDelivery>>;
    create(data: CreateDeliveryInput): Promise<Result<TDelivery>>;
    update(id: string, data: UpdateDeliveryInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}