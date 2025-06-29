import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import validate from "../validators/validate.js";
import { registerSchema } from "../validators/register.validator.js";
const authRouter = Router();
authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', login);
export default authRouter;
