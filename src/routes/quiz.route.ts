import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { getAllQuizzes, getCurrentQuiz, getFinishedQuizzes } from "../controllers/quiz.controller";
import courseMiddleware from "../middlewares/course.middleware";

const quizRouter = Router();

quizRouter.get("/", authMiddleware, courseMiddleware, getAllQuizzes);
// quizRouter.get("/:id", authMiddleware, courseMiddleware, getCurrentQuiz);
quizRouter.get("/finished", authMiddleware, getFinishedQuizzes)

export default quizRouter;