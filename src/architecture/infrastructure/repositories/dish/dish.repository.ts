import { IDishRepository } from "@/src/architecture/core/domain/repository/dish/i-dish.repository";
import { CreateDishInput, TDish, UpdateDishInput } from "@/src/architecture/core/domain/entities/Dish";
import { GetDishesFilters } from "@/src/architecture/core/domain/dish/get-dishes-filters";
import { HttpClient } from "../../http";
import { Result } from "@/src/libs/result";

export class DishRepository implements IDishRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(filters?: GetDishesFilters): Promise<Result<TDish[]>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        if (filters?.menu_type_id) params.set("menu_type_id", filters.menu_type_id);
        const qs = params.toString();
        const endpoint = qs ? `dishes?${qs}` : "dishes";

        return await this.httpClient.get<TDish[]>(endpoint, {
            tags: ["dishes"],
        });
    }

    async create(data: CreateDishInput): Promise<Result<TDish>> {
        return await this.httpClient.post<TDish>("dishes", data);
    }

    async getById(id: string): Promise<Result<TDish>> {
        const params = new URLSearchParams({ dishId: id });
        return await this.httpClient.get<TDish>(`dishes/one?${params.toString()}`, {
            tags: ["dishes"],
        });
    }

    async update(id: string, data: UpdateDishInput): Promise<Result<void>> {
        return await this.httpClient.put<void>("dishes", { id, ...data });
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("dishes", { id });
    }
}
