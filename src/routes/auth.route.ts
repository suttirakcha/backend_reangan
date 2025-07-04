import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import validate from "../validators/validate";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.validator";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);

export default authRouter;