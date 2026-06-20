import { z } from "zod";
import { TCustomer } from "./Customer";
import { TDelivery } from "./Delivery";
import { TMenuType } from "./MenuType";
import { TProductCategory } from "./ProductCategory";

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
        price?: number;
        category?: TProductCategory | null;
    } | null;
    quantity: number;
    total_amount?: number | null;
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

export type TExtraTotalQty = {
    extra_product?: {
        id: string;
        name: string;
        price?: number;
        category?: TProductCategory | null;
    } | null;
    total_qty: number;
    total_amount?: number | null;
};

export type TExtrasTotals = {
    date: string;
    totals: TExtraTotalQty[];
    grand_total?: number | null;
};

export const dailyProductionLineInputSchema = z.object({
    menu_type_id: z.uuid("Debe seleccionar un tipo de menú válido"),
    quantity: z
        .number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser mayor a 0"),
});

const createDailyProductionFormLineSchema = z.object({
    menu_type_id: z.string(),
    quantity: z
        .number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser mayor a 0"),
});

const createDailyProductionFormExtraSchema = z.object({
    extra_product_id: z.string(),
    quantity: z
        .number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser mayor a 0"),
});

function refineDailyProductionDelivery(
    data: { fulfillment_type: TFulfillmentType; delivery_id?: string | null },
    ctx: z.RefinementCtx,
) {
    if (data.fulfillment_type === "DELIVERY" && !data.delivery_id) {
        ctx.addIssue({
            code: "custom",
            path: ["delivery_id"],
            message: "Seleccioná un repartidor para el delivery",
        });
    }
}

export const createDailyProductionPayloadSchema = z
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
        lines: z.array(dailyProductionLineInputSchema).default([]),
    })
    .superRefine(refineDailyProductionDelivery)
    .transform((data) => ({
        ...data,
        delivery_id: data.fulfillment_type === "DELIVERY" ? data.delivery_id : undefined,
        notes: data.notes?.trim() ? data.notes.trim() : null,
    }));

export type CreateDailyProductionPayload = z.output<typeof createDailyProductionPayloadSchema>;

const ORDER_ITEMS_REQUIRED_MESSAGE =
    "Seleccioná al menos un menú o un producto";

export const createDailyProductionFormInputSchema = z
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
        lines: z.array(createDailyProductionFormLineSchema).default([]),
        extras: z.array(createDailyProductionFormExtraSchema).default([]),
    })
    .superRefine((data, ctx) => {
        refineDailyProductionDelivery(data, ctx);

        const validLines = data.lines.filter((line) => line.menu_type_id.trim() !== "");
        const validExtras = data.extras.filter(
            (extra) => extra.extra_product_id.trim() !== "",
        );

        if (validLines.length === 0 && validExtras.length === 0) {
            if (data.lines.length > 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["lines", 0, "menu_type_id"],
                    message: ORDER_ITEMS_REQUIRED_MESSAGE,
                });
            }

            if (data.extras.length > 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["extras", 0, "extra_product_id"],
                    message: ORDER_ITEMS_REQUIRED_MESSAGE,
                });
            }
        }

        for (const [index, line] of data.lines.entries()) {
            if (line.menu_type_id.trim() === "") {
                continue;
            }

            const parsed = z
                .uuid("Debe seleccionar un tipo de menú válido")
                .safeParse(line.menu_type_id);
            if (!parsed.success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["lines", index, "menu_type_id"],
                    message: parsed.error.issues[0]?.message ?? "Menú inválido",
                });
            }
        }

        for (const [index, extra] of data.extras.entries()) {
            if (extra.extra_product_id.trim() === "") {
                continue;
            }

            const parsed = z
                .uuid("Debe seleccionar un producto válido")
                .safeParse(extra.extra_product_id);
            if (!parsed.success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["extras", index, "extra_product_id"],
                    message: parsed.error.issues[0]?.message ?? "Producto inválido",
                });
            }
        }
    });

export const createDailyProductionFormParsedSchema =
    createDailyProductionFormInputSchema.transform((data) => ({
        production_date: data.production_date,
        customer_id: data.customer_id,
        fulfillment_type: data.fulfillment_type,
        delivery_id: data.fulfillment_type === "DELIVERY" ? data.delivery_id : undefined,
        notes: data.notes?.trim() ? data.notes.trim() : null,
        lines: data.lines
            .filter((line) => line.menu_type_id.trim() !== "")
            .map((line) => ({
                menu_type_id: line.menu_type_id,
                quantity: line.quantity,
            })),
        extras: data.extras
            .filter((extra) => extra.extra_product_id.trim() !== "")
            .map((extra) => ({
                extra_product_id: extra.extra_product_id,
                quantity: extra.quantity,
            })),
    }));

export type CreateDailyProductionFormInput = z.input<
    typeof createDailyProductionFormInputSchema
>;
export type CreateDailyProductionFormOutput = z.output<
    typeof createDailyProductionFormParsedSchema
>;

/** @deprecated Use createDailyProductionFormInputSchema in forms */
export const createDailyProductionInputSchema = createDailyProductionFormInputSchema;
/** @deprecated Use CreateDailyProductionFormInput */
export type CreateDailyProductionInput = CreateDailyProductionFormInput;

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

export const addDailyProductionExtraInputSchema = z.object({
    extra_product_id: z.uuid("Debe seleccionar un producto válido"),
    quantity: z
        .number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad debe ser mayor a 0"),
});

export type AddDailyProductionExtraInput = z.infer<
    typeof addDailyProductionExtraInputSchema
>;

export const updateDailyProductionExtraInputSchema =
    addDailyProductionExtraInputSchema;

export type UpdateDailyProductionExtraInput = z.infer<
    typeof updateDailyProductionExtraInputSchema
>;

export const deleteDailyProductionInputSchema = z.object({
    id: z.uuid("El ID de la producción debe ser válido"),
});

export type DeleteDailyProductionInput = z.infer<typeof deleteDailyProductionInputSchema>;
