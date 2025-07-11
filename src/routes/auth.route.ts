import { Router } from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/auth.controller";
import validate from "../validators/validate";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.validator";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.patch('/reset-password/:token', resetPassword);

export default authRouter;