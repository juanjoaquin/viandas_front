import { IExtraProductRepository } from "@/src/architecture/core/domain/repository/extra-product/i-extra-product.repository";
import {
    CreateExtraProductInput,
    TExtraProduct,
    UpdateExtraProductInput,
} from "@/src/architecture/core/domain/entities/ExtraProduct";
import { GetExtraProductsFilters } from "@/src/architecture/core/domain/extra-product/get-extra-products-filters";
import { HttpClient } from "../../http";
import { appendPaginationParams, Paginated } from "@/src/architecture/core/domain/pagination";
import { Result } from "@/src/libs/result";

export class ExtraProductRepository implements IExtraProductRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(
        filters?: GetExtraProductsFilters,
    ): Promise<Result<Paginated<TExtraProduct>>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        appendPaginationParams(params, filters);
        const qs = params.toString();
        const endpoint = qs ? `extra-products?${qs}` : "extra-products";

        return await this.httpClient.getPaginated<TExtraProduct>(endpoint, {
            tags: ["extra-products"],
        });
    }

    async create(data: CreateExtraProductInput): Promise<Result<TExtraProduct>> {
        return await this.httpClient.post<TExtraProduct>("extra-products", data);
    }

    async getById(id: string): Promise<Result<TExtraProduct>> {
        const params = new URLSearchParams({ extraProductId: id });
        return await this.httpClient.get<TExtraProduct>(
            `extra-products/one?${params.toString()}`,
            {
                tags: ["extra-products", `extra-product-${id}`],
            },
        );
    }

    async update(
        id: string,
        data: UpdateExtraProductInput,
    ): Promise<Result<void>> {
        return await this.httpClient.put<void>("extra-products", { id, ...data });
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("extra-products", { id });
    }
}
