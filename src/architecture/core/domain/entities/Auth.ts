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

export const forgotPasswordInputSchema = z.object({
  email: z.email("Email inválido"),
});

export const resetPasswordInputSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const resetPasswordFormSchema = resetPasswordInputSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterWithInviteInput = z.infer<typeof registerWithInviteInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutInput = {
  refreshToken: string;
};
