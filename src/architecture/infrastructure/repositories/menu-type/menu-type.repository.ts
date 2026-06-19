import { IMenuTypeRepository } from "@/src/architecture/core/domain/repository/menu-type/i-menu-type.repository";
import {
    CreateMenuTypeInput,
    TMenuType,
    UpdateMenuTypeInput,
} from "@/src/architecture/core/domain/entities/MenuType";
import { GetMenuTypesFilters } from "@/src/architecture/core/domain/menu-type/get-menu-types-filters";
import { HttpClient } from "../../http";
import { Result } from "@/src/libs/result";

export class MenuTypeRepository implements IMenuTypeRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(filters?: GetMenuTypesFilters): Promise<Result<TMenuType[]>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        if (filters?.active !== undefined) {
            params.set("active", String(filters.active));
        }
        const qs = params.toString();
        const endpoint = qs ? `menu-types?${qs}` : "menu-types";

        return await this.httpClient.get<TMenuType[]>(endpoint, {
            tags: ["menu-types"],
        });
    }

    async create(data: CreateMenuTypeInput): Promise<Result<TMenuType>> {
        return await this.httpClient.post<TMenuType>("menu-types", data);
    }

    async getById(id: string): Promise<Result<TMenuType>> {
        const params = new URLSearchParams({ menuTypeId: id });

        return await this.httpClient.get<TMenuType>(
            `menu-types/one?${params.toString()}`,
            {
                tags: ["menu-types", `menu-type-${id}`],
            },
        );
    }

    async update(id: string, data: UpdateMenuTypeInput): Promise<Result<void>> {
        return await this.httpClient.put<void>("menu-types", {
            id,
            name: data.name,
            price: data.price,
            active: data.active,
        });
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("menu-types", { id });
    }
}
