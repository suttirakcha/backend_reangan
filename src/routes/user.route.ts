import { Router } from "express";

const userRouter = Router();

// For having a look at his/her profile
userRouter.get('/:userId', () => {});

// For updating user profile
userRouter.patch('/:userId', () => {});

// In case the user wants to delete his/her account
userRouter.delete('/:userId', () => {});

export default userRouter;