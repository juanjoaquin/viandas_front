import { z } from "zod";

export type TMenuType = {
    id: string;
    name: string;
    price?: number | null;
    active: boolean;
    created_at: string;
};

export const createMenuTypeInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    price: z
        .number()
        .positive("El precio debe ser mayor a 0")
        .nullable()
        .optional(),
});

export type CreateMenuTypeInput = z.infer<typeof createMenuTypeInputSchema>;

export type CreateMenuTypeFormInput = {
    name: string;
    price?: string | number | null;
};

function parsePriceInput(
    price: string | number | null | undefined,
): number | null {
    if (price == null || price === "") {
        return null;
    }

    const parsed = typeof price === "number" ? price : Number(price);
    return Number.isNaN(parsed) ? null : parsed;
}

export function parseCreateMenuTypeInput(
    data: CreateMenuTypeFormInput,
): z.ZodSafeParseResult<CreateMenuTypeInput> {
    return createMenuTypeInputSchema.safeParse({
        name: data.name,
        price: parsePriceInput(data.price),
    });
}

export const updateMenuTypeInputSchema = createMenuTypeInputSchema.extend({
    active: z.boolean(),
});

export type UpdateMenuTypeInput = z.infer<typeof updateMenuTypeInputSchema>;

export type UpdateMenuTypeFormInput = {
    name: string;
    price?: string | number | null;
    active: boolean;
};

export function parseUpdateMenuTypeInput(
    data: UpdateMenuTypeFormInput,
): z.ZodSafeParseResult<UpdateMenuTypeInput> {
    return updateMenuTypeInputSchema.safeParse({
        name: data.name,
        price: parsePriceInput(data.price),
        active: data.active,
    });
}

export const deleteMenuTypeInputSchema = z.object({
    id: z.uuid("El ID debe ser un UUID válido"),
});

export type DeleteMenuTypeInput = z.infer<typeof deleteMenuTypeInputSchema>;
