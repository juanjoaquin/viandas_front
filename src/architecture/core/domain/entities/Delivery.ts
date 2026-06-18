import z from "zod";
import { phoneSchema } from "./Customer";


export type TDelivery = {
    id: string;
    name: string;
    phone?: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const createDeliveryInputSchema = z.object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    phone: phoneSchema,
});

export type CreateDeliveryInput = z.infer<typeof createDeliveryInputSchema>;

export const updateDeliveryInputSchema = createDeliveryInputSchema.extend({
    active: z.boolean(),
});
export type UpdateDeliveryInput = z.infer<typeof updateDeliveryInputSchema>;

export const deleteDeliveryInputSchema = z.object({
    id: z.uuid("El ID debe ser un UUID válido")
});
export type DeleteDeliveryInput = z.infer<typeof deleteDeliveryInputSchema>;