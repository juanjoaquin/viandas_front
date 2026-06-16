import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
