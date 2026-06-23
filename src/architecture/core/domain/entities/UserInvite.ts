import { z } from "zod";

export const createUserInviteInputSchema = z.object({
  email: z.email("Email inválido"),
  role: z.literal("EMPLOYEE"),
});

export type CreateUserInviteInput = z.infer<typeof createUserInviteInputSchema>;

export type TUserInvite = {
  id: string;
  email: string;
  role: string;
  invite_url: string;
  expires_at: string;
  created_at: string;
};
