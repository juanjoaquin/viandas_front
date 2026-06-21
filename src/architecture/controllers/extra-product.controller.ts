import { Paginated } from "../core/domain/pagination";
import { Err, Result } from "@/src/libs/result";
import {
    CreateExtraProductInput,
    TExtraProduct,
    UpdateExtraProductInput,
} from "../core/domain/entities/ExtraProduct";
import { GetExtraProductsFilters } from "../core/domain/extra-product/get-extra-products-filters";
import { IExtraProductRepository } from "../core/domain/repository/extra-product/i-extra-product.repository";
import { createExtraProductUseCase } from "../use-cases/extra-product/create-extra-product.use-case";
import { deleteExtraProductUseCase } from "../use-cases/extra-product/delete-extra-product.use-case";
import { getAllExtraProductsUseCase } from "../use-cases/extra-product/get-all-extra-products.use-case";
import { getExtraProductByIdUseCase } from "../use-cases/extra-product/get-extra-product-by-id.use-case";
import { updateExtraProductUseCase } from "../use-cases/extra-product/update-extra-product.use-case";
import { Logger } from "../infrastructure/logger/logger";

export class ExtraProductController {
    constructor(private readonly repository: IExtraProductRepository) {}

    async getAllExtraProducts(
        filters?: GetExtraProductsFilters,
    ): Promise<Result<Paginated<TExtraProduct>>> {
        try {
            const result = await getAllExtraProductsUseCase(
                this.repository,
                filters,
            );

            if (!result.success) {
                Logger.error(
                    "[EXTRA-PRODUCT-CONTROLLER][GET-ALL-EXTRA-PRODUCTS] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[EXTRA-PRODUCT-CONTROLLER][GET-ALL-EXTRA-PRODUCTS] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async createExtraProduct(
        data: CreateExtraProductInput,
    ): Promise<Result<TExtraProduct>> {
        try {
            const result = await createExtraProductUseCase(this.repository, data);

            if (!result.success) {
                Logger.error(
                    "[EXTRA-PRODUCT-CONTROLLER][CREATE-EXTRA-PRODUCT] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[EXTRA-PRODUCT-CONTROLLER][CREATE-EXTRA-PRODUCT] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async getExtraProductById(id: string): Promise<Result<TExtraProduct>> {
        try {
            const result = await getExtraProductByIdUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[EXTRA-PRODUCT-CONTROLLER][GET-EXTRA-PRODUCT-BY-ID] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[EXTRA-PRODUCT-CONTROLLER][GET-EXTRA-PRODUCT-BY-ID] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async updateExtraProduct(
        id: string,
        data: UpdateExtraProductInput,
    ): Promise<Result<void>> {
        try {
            const result = await updateExtraProductUseCase(
                this.repository,
                id,
                data,
            );

            if (!result.success) {
                Logger.error(
                    "[EXTRA-PRODUCT-CONTROLLER][UPDATE-EXTRA-PRODUCT] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[EXTRA-PRODUCT-CONTROLLER][UPDATE-EXTRA-PRODUCT] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }

    async deleteExtraProduct(id: string): Promise<Result<void>> {
        try {
            const result = await deleteExtraProductUseCase(this.repository, id);

            if (!result.success) {
                Logger.error(
                    "[EXTRA-PRODUCT-CONTROLLER][DELETE-EXTRA-PRODUCT] Controller returned error",
                    { error: result.error, code: result.code },
                );
            }

            return result;
        } catch (error) {
            Logger.error(
                "[EXTRA-PRODUCT-CONTROLLER][DELETE-EXTRA-PRODUCT] Unexpected error",
                error,
            );

            return Err(
                error instanceof Error ? error.message : "Error desconocido",
                "UNKNOWN",
            );
        }
    }
}
