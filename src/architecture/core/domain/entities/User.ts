import z from "zod";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
};

export const updateUserInputSchema = z.object({
  active: z.boolean(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
