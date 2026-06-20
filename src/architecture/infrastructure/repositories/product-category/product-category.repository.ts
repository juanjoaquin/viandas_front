import { IProductCategoryRepository } from "@/src/architecture/core/domain/repository/product-category/i-product-category.repository";
import {
    CreateProductCategoryInput,
    TProductCategory,
    UpdateProductCategoryInput,
} from "@/src/architecture/core/domain/entities/ProductCategory";
import { GetProductCategoriesFilters } from "@/src/architecture/core/domain/product-category/get-product-categories-filters";
import { HttpClient } from "../../http";
import { Result } from "@/src/libs/result";

export class ProductCategoryRepository implements IProductCategoryRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(
        filters?: GetProductCategoriesFilters,
    ): Promise<Result<TProductCategory[]>> {
        const params = new URLSearchParams();
        if (filters?.q) params.set("q", filters.q);
        if (filters?.active !== undefined) {
            params.set("active", String(filters.active));
        }
        const qs = params.toString();
        const endpoint = qs ? `product-categories?${qs}` : "product-categories";

        return await this.httpClient.get<TProductCategory[]>(endpoint, {
            tags: ["product-categories"],
        });
    }

    async create(
        data: CreateProductCategoryInput,
    ): Promise<Result<TProductCategory>> {
        return await this.httpClient.post<TProductCategory>(
            "product-categories",
            data,
        );
    }

    async getById(id: string): Promise<Result<TProductCategory>> {
        const params = new URLSearchParams({ productCategoryId: id });

        return await this.httpClient.get<TProductCategory>(
            `product-categories/one?${params.toString()}`,
            {
                tags: ["product-categories", `product-category-${id}`],
            },
        );
    }

    async update(
        id: string,
        data: UpdateProductCategoryInput,
    ): Promise<Result<void>> {
        return await this.httpClient.put<void>("product-categories", {
            id,
            name: data.name,
            active: data.active,
        });
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>("product-categories", { id });
    }
}
