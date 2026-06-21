import { z } from "zod";
import { TMenuType } from "./MenuType";
import { TProductCategory } from "./ProductCategory";

export type TProductionOverviewFilters = {
    from: string;
    to: string;
};

export type TProductionOverviewSummary = {
    total_menus_qty: number;
    total_menus_amount: number;
    total_products_qty: number;
    total_products_amount: number;
    grand_total_amount: number;
};

export type TProductionOverviewMenu = {
    menu_type?: TMenuType | null;
    total_qty: number;
    total_amount?: number | null;
};

export type TProductionOverviewProduct = {
    extra_product?: {
        id: string;
        name: string;
        price: number;
        category?: TProductCategory | null;
    } | null;
    total_qty: number;
    total_amount: number;
};

export type TProductionOverview = {
    period: TProductionOverviewFilters;
    summary: TProductionOverviewSummary;
    menus_by_type: TProductionOverviewMenu[];
    products: TProductionOverviewProduct[];
};

export const productionOverviewFiltersSchema = z
    .object({
        from: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha desde debe tener formato YYYY-MM-DD"),
        to: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha hasta debe tener formato YYYY-MM-DD"),
    })
    .superRefine((data, ctx) => {
        const from = new Date(`${data.from}T12:00:00`);
        const to = new Date(`${data.to}T12:00:00`);

        if (to < from) {
            ctx.addIssue({
                code: "custom",
                path: ["to"],
                message: "La fecha hasta debe ser mayor o igual a la fecha desde",
            });
        }
    });
