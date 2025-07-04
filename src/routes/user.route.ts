import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { deleteAccount, getMe, updateAccount } from "../controllers/user.controller";
import validate from "../validators/validate";
import { userSchema } from "../validators/user.validator";

const userRouter = Router();

// For having a look at his/her profile
userRouter.get('/me', authMiddleware, getMe);

// For updating user profile
userRouter.patch('/me', authMiddleware, updateAccount);

// In case the user wants to delete his/her account
userRouter.delete('/me', authMiddleware, deleteAccount);

export default userRouter;