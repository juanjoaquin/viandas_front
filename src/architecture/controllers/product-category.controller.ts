import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import { IProductCategoryRepository } from "../core/domain/repository/product-category/i-product-category.repository";
import {
    CreateProductCategoryInput,
    TProductCategory,
    UpdateProductCategoryInput,
} from "../core/domain/entities/ProductCategory";
import { GetProductCategoriesFilters } from "../core/domain/product-category/get-product-categories-filters";
import { getAllProductCategoriesUseCase } from "../use-cases/product-category/get-all-product-categories.use-case";
import { createProductCategoryUseCase } from "../use-cases/product-category/create-product-category.use-case";
import { getProductCategoryByIdUseCase } from "../use-cases/product-category/get-product-category-by-id.use-case";
import { updateProductCategoryUseCase } from "../use-cases/product-category/update-product-category.use-case";
import { deleteProductCategoryUseCase } from "../use-cases/product-category/delete-product-category.use-case";
import { Logger } from "../infrastructure/logger/logger";

export class ProductCategoryController {
    constructor(private readonly repository: IProductCategoryRepository) {}

    async getAllProductCategories(
        filters?: GetProductCategoriesFilters,
    ): Promise<Result<Paginated<TProductCategory>>> {
        try {
            const result = await getAllProductCategoriesUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[PRODUCT-CATEGORY-CONTROLLER][GET-ALL-PRODUCT-CATEGORIES] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[PRODUCT-CATEGORY-CONTROLLER][GET-ALL-PRODUCT-CATEGORIES] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createProductCategory(
        data: CreateProductCategoryInput,
    ): Promise<Result<TProductCategory>> {
        try {
            const result = await createProductCategoryUseCase(
                this.repository,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[PRODUCT-CATEGORY-CONTROLLER][CREATE-PRODUCT-CATEGORY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[PRODUCT-CATEGORY-CONTROLLER][CREATE-PRODUCT-CATEGORY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getProductCategoryById(
        id: string,
    ): Promise<Result<TProductCategory>> {
        try {
            const result = await getProductCategoryByIdUseCase(
                this.repository,
                id,
            );

            if (!result.success) {
                Logger.error(
                    "[PRODUCT-CATEGORY-CONTROLLER][GET-PRODUCT-CATEGORY-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[PRODUCT-CATEGORY-CONTROLLER][GET-PRODUCT-CATEGORY-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateProductCategory(
        id: string,
        data: UpdateProductCategoryInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateProductCategoryUseCase(
                this.repository,
                id,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[PRODUCT-CATEGORY-CONTROLLER][UPDATE-PRODUCT-CATEGORY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[PRODUCT-CATEGORY-CONTROLLER][UPDATE-PRODUCT-CATEGORY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteProductCategory(id: string): Promise<Result<void>> {
        try {
            const result = await deleteProductCategoryUseCase(
                this.repository,
                id,
            );

            if (!result.success) {
                Logger.error(
                    "[PRODUCT-CATEGORY-CONTROLLER][DELETE-PRODUCT-CATEGORY] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[PRODUCT-CATEGORY-CONTROLLER][DELETE-PRODUCT-CATEGORY] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
