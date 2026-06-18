import { z } from "zod";
import { CustomerType } from "../customer/get-customers-filters";

export type TCustomer = {
    id: string;
    name: string;
    type: CustomerType;
    phone?: string | null;
    address?: string | null;
    created_at?: string;
};

export const phoneSchema = z
    .union([z.string(), z.null()])
    .optional()
    .refine(
        (val) => val == null || val.trim() === "" || /^\d+$/.test(val.trim()),
        "El teléfono solo puede contener números",
    );

export const createCustomerInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    type: z.enum(["COMPANY", "PERSON"]),
    phone: phoneSchema,
    address: z.string().nullable().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;

export const updateCustomerInputSchema = createCustomerInputSchema;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>;

export const deleteCustomerInputSchema = z.object({
    id: z.uuid("El ID debe ser un UUID válido")
});
export type DeleteCustomerInput = z.infer<typeof deleteCustomerInputSchema>;
