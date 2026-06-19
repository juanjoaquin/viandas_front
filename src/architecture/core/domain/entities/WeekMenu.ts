import { z } from "zod";
import { TMenuType } from "./MenuType";
import { TDish } from "./Dish";

export type TWeekMenu = {
    id: string;
    week_start_date: string;
    week_end_date: string;
    created_by: string;
    created_at: string;
    items?: TWeekMenuItem[];
};

export type TWeekMenuItem = {
    id: string;
    week_menu_id: string;
    menu_date: string;
    menu_type?: TMenuType | null;
    dish?: TDish | null;
};

export type TDayMenuLine = {
    menu_type?: TMenuType | null;
    dish?: TDish | null;
};

export type TDayMenu = {
    date: string;
    lines: TDayMenuLine[];
};

export const createWeekMenuInputSchema = z
    .object({
        week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
        week_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    })
    .refine(
        (data) => data.week_end_date >= data.week_start_date,
        {
            message: "La fecha de fin debe ser igual o posterior a la de inicio",
            path: ["week_end_date"],
        },
    );

export type CreateWeekMenuInput = z.infer<typeof createWeekMenuInputSchema>;

export const addWeekMenuItemInputSchema = z.object({
    menu_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    menu_type_id: z.string().uuid("Debe seleccionar un tipo de menú válido"),
    dish_id: z.string().uuid("Debe seleccionar un plato válido"),
});

export type AddWeekMenuItemInput = z.infer<typeof addWeekMenuItemInputSchema>;

export const updateWeekMenuItemInputSchema = z.object({
    dish_id: z.string().uuid("Debe seleccionar un plato válido"),
});

export type UpdateWeekMenuItemInput = z.infer<typeof updateWeekMenuItemInputSchema>;
