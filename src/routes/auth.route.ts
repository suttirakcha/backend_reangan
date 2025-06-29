import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import validate from "../validators/validate";
import { registerSchema } from "../validators/register.validator";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getMe);

export default authRouter;