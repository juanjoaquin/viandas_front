import { z } from "zod";
import { TCustomer } from "./Customer";
import { TDelivery } from "./Delivery";
import { TMenuType } from "./MenuType";

export const fulfillmentTypes = ["PENDING", "DELIVERY", "PICKUP"] as const;
export const dailyProductionSortOptions = ["quantity"] as const;
export const sortOrderOptions = ["asc", "desc"] as const;

export type TFulfillmentType = (typeof fulfillmentTypes)[number];
export type TDailyProductionSort = (typeof dailyProductionSortOptions)[number];
export type TSortOrder = (typeof sortOrderOptions)[number];

export type TDailyProductionFilters = {
    q?: string;
    fulfillment_type?: TFulfillmentType;
    menu_type_id?: string;
    delivery_id?: string;
    sort?: TDailyProductionSort;
    order?: TSortOrder;
};

export type TDailyProductionLine = {
    id: string;
    menu_type?: TMenuType | null;
    quantity: number;
};

export type TDailyProductionExtra = {
    id: string;
    extra_product?: {
        id: string;
        name: string;
        category?: string | null;
    } | null;
    quantity: number;
};

export type TDailyProduction = {
    id: string;
    production_date: string;
    fulfillment_type: TFulfillmentType;
    customer?: Pick<TCustomer, "id" | "name" | "type"> | null;
    delivery?: Pick<TDelivery, "id" | "name" | "phone"> | null;
    lines?: TDailyProductionLine[];
    extras?: TDailyProductionExtra[];
    notes?: string | null;
    created_by: string;
    created_at: string;
};

export type TMenuTypeTotalQty = {
    menu_type?: TMenuType | null;
    total_qty: number;
    total_amount?: number | null;
};

export type TKitchenTotals = {
    date: string;
    totals: TMenuTypeTotalQty[];
    grand_total?: number | null;
};

export const dailyProductionLineInputSchema = z.object({
    menu_type_id: z.uuid("Debe seleccionar un tipo de menú válido"),
    quantity: z
        .number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser mayor a 0"),
});

export const createDailyProductionInputSchema = z
    .object({
        production_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD"),
        customer_id: z.uuid("Debe seleccionar un cliente válido"),
        fulfillment_type: z.enum(fulfillmentTypes),
        delivery_id: z
            .union([z.uuid("Debe seleccionar un repartidor válido"), z.literal(""), z.null()])
            .optional(),
        notes: z.string().nullable().optional(),
        lines: z
            .array(dailyProductionLineInputSchema)
            .min(1, "Debe cargar al menos un tipo de menú"),
    })
    .superRefine((data, ctx) => {
        if (data.fulfillment_type === "DELIVERY" && !data.delivery_id) {
            ctx.addIssue({
                code: "custom",
                path: ["delivery_id"],
                message: "Seleccioná un repartidor para el delivery",
            });
        }
    })
    .transform((data) => ({
        ...data,
        delivery_id: data.fulfillment_type === "DELIVERY" ? data.delivery_id : undefined,
        notes: data.notes?.trim() ? data.notes.trim() : null,
    }));

export type CreateDailyProductionInput = z.input<typeof createDailyProductionInputSchema>;
export type CreateDailyProductionPayload = z.output<typeof createDailyProductionInputSchema>;

export const updateDailyProductionInputSchema = z
    .object({
        id: z.uuid("El ID de la producción debe ser válido"),
        fulfillment_type: z.enum(fulfillmentTypes).optional(),
        delivery_id: z
            .union([z.uuid("Debe seleccionar un repartidor válido"), z.literal(""), z.null()])
            .optional(),
        notes: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.fulfillment_type === "DELIVERY" && !data.delivery_id) {
            ctx.addIssue({
                code: "custom",
                path: ["delivery_id"],
                message: "Seleccioná un repartidor para el delivery",
            });
        }
    })
    .transform((data) => ({
        ...data,
        delivery_id: data.fulfillment_type === "DELIVERY" ? data.delivery_id : undefined,
        notes: data.notes?.trim() ? data.notes.trim() : null,
    }));

export type UpdateDailyProductionInput = z.input<typeof updateDailyProductionInputSchema>;
export type UpdateDailyProductionPayload = z.output<typeof updateDailyProductionInputSchema>;

export const upsertDailyProductionLineInputSchema = dailyProductionLineInputSchema;
export type UpsertDailyProductionLineInput = z.infer<typeof upsertDailyProductionLineInputSchema>;

export const deleteDailyProductionInputSchema = z.object({
    id: z.uuid("El ID de la producción debe ser válido"),
});

export type DeleteDailyProductionInput = z.infer<typeof deleteDailyProductionInputSchema>;
