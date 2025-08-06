import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { createQuestion, deleteQuestion, updateQuestion } from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.post("/", authMiddleware, createQuestion);
questionRouter.patch("/:id", authMiddleware, updateQuestion);
questionRouter.delete("/:id", authMiddleware, deleteQuestion);

export default questionRouter;