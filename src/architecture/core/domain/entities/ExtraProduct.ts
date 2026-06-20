import { z } from "zod";
import { TProductCategory } from "./ProductCategory";

export type TExtraProduct = {
    id: string;
    name: string;
    category?: TProductCategory | null;
    price: number;
    active: boolean;
    created_at: string;
};

export const createExtraProductInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    category_id: z.uuid("Debe seleccionar una categoría válida"),
    price: z.number().positive("El precio debe ser mayor a 0"),
});

export type CreateExtraProductInput = z.infer<typeof createExtraProductInputSchema>;

export type CreateExtraProductFormInput = {
    name: string;
    category_id: string;
    price?: string | number;
};

function parsePriceInput(
    price: string | number | undefined,
): number | null {
    if (price == null || price === "") {
        return null;
    }

    const parsed = typeof price === "number" ? price : Number(price);
    return Number.isNaN(parsed) ? null : parsed;
}

export function parseCreateExtraProductInput(
    data: CreateExtraProductFormInput,
): z.ZodSafeParseResult<CreateExtraProductInput> {
    return createExtraProductInputSchema.safeParse({
        name: data.name,
        category_id: data.category_id,
        price: parsePriceInput(data.price),
    });
}

export const updateExtraProductInputSchema = createExtraProductInputSchema.extend({
    active: z.boolean(),
});

export type UpdateExtraProductInput = z.infer<typeof updateExtraProductInputSchema>;

export type UpdateExtraProductFormInput = {
    name: string;
    category_id: string;
    price?: string | number;
    active: boolean;
};

export function parseUpdateExtraProductInput(
    data: UpdateExtraProductFormInput,
): z.ZodSafeParseResult<UpdateExtraProductInput> {
    return updateExtraProductInputSchema.safeParse({
        name: data.name,
        category_id: data.category_id,
        price: parsePriceInput(data.price),
        active: data.active,
    });
}

export const deleteExtraProductInputSchema = z.object({
    id: z.uuid("El ID debe ser un UUID válido"),
});

export type DeleteExtraProductInput = z.infer<typeof deleteExtraProductInputSchema>;
