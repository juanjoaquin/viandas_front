import { z } from "zod";
import { TMenuType } from "./MenuType";

export type TDish = {
    id: string;
    name: string;
    description: string;
    menu_type?: TMenuType | null;
    active: boolean;
    created_at: string;
};

export const createDishInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().trim(),
    menu_type_id: z.string().uuid("Debe seleccionar un tipo de menú válido"),
});

export type CreateDishInput = z.infer<typeof createDishInputSchema>;

export const updateDishInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().trim(),
    menu_type_id: z.string().uuid("Debe seleccionar un tipo de menú válido"),
    active: z.boolean(),
});

export type UpdateDishInput = z.infer<typeof updateDishInputSchema>;

export const deleteDishInputSchema = z.object({
    id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteDishInput = z.infer<typeof deleteDishInputSchema>;
