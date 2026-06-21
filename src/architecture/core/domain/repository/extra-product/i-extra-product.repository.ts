import { Result } from "@/src/libs/result";
import { Paginated } from "../../pagination";
import {
    CreateExtraProductInput,
    TExtraProduct,
    UpdateExtraProductInput,
} from "../../entities/ExtraProduct";
import { GetExtraProductsFilters } from "../../extra-product/get-extra-products-filters";

export interface IExtraProductRepository {
    getAll(filters?: GetExtraProductsFilters): Promise<Result<Paginated<TExtraProduct>>>;
    create(data: CreateExtraProductInput): Promise<Result<TExtraProduct>>;
    getById(id: string): Promise<Result<TExtraProduct>>;
    update(id: string, data: UpdateExtraProductInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}
