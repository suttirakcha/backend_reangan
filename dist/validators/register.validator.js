import { z } from "zod";
export const registerSchema = z
    .object({
    username: z.string().nonempty("Username is required"),
    email: z.string().email().nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
    confirm_password: z.string().nonempty("Confirm password is required"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Password does not match",
    path: ["confirm_password"],
});
