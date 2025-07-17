import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { createQuiz, deleteQuiz, getFinishedQuizzes, updateQuiz } from "../controllers/quiz.controller";

const quizRouter = Router();

// For users
quizRouter.get("/finished", authMiddleware, getFinishedQuizzes)

// For admins
quizRouter.post("/", authMiddleware, createQuiz);
quizRouter.patch("/:id", authMiddleware, updateQuiz);
quizRouter.delete("/:id", authMiddleware, deleteQuiz);

export default quizRouter;