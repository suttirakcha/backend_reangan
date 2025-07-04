import { z } from "zod";

export const userSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email().nonempty("Email is required"),
  current_password: z.string().optional(),
  new_password: z.string().optional()
});

export type UserFields = z.infer<typeof userSchema>;
