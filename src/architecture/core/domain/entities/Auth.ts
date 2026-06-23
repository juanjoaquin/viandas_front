import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerWithInviteInputSchema = z.object({
  token: z.string().min(1, "Token de invitación requerido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterWithInviteInput = z.infer<typeof registerWithInviteInputSchema>;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutInput = {
  refreshToken: string;
};
