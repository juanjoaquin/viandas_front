import { Result } from "@/src/libs/result";
import { Paginated } from "../../pagination";
import {
    CreateProductCategoryInput,
    TProductCategory,
    UpdateProductCategoryInput,
} from "../../entities/ProductCategory";
import { GetProductCategoriesFilters } from "../../product-category/get-product-categories-filters";

export interface IProductCategoryRepository {
    getAll(
        filters?: GetProductCategoriesFilters,
    ): Promise<Result<Paginated<TProductCategory>>>;
    create(data: CreateProductCategoryInput): Promise<Result<TProductCategory>>;
    getById(id: string): Promise<Result<TProductCategory>>;
    update(id: string, data: UpdateProductCategoryInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}
