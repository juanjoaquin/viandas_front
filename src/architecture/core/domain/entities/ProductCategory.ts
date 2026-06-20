import { z } from "zod";

export type TProductCategory = {
    id: string;
    name: string;
    active: boolean;
    created_at: string;
};

export const createProductCategoryInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateProductCategoryInput = z.infer<
    typeof createProductCategoryInputSchema
>;

export const updateProductCategoryInputSchema =
    createProductCategoryInputSchema.extend({
        active: z.boolean(),
    });

export type UpdateProductCategoryInput = z.infer<
    typeof updateProductCategoryInputSchema
>;

export const deleteProductCategoryInputSchema = z.object({
    id: z.uuid("El ID debe ser un UUID válido"),
});

export type DeleteProductCategoryInput = z.infer<
    typeof deleteProductCategoryInputSchema
>;
