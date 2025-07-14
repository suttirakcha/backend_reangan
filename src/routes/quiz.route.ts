import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { getAllQuizzes, getCurrentQuiz, getFinishedQuizzes } from "../controllers/quiz.controller";
import courseMiddleware from "../middlewares/course.middleware";

const quizRouter = Router();

// For users
// quizRouter.get("/", authMiddleware, courseMiddleware, getAllQuizzes);
quizRouter.get("/finished", authMiddleware, getFinishedQuizzes)

// For admins
// quizRouter.get("/:id", authMiddleware, courseMiddleware, getCurrentQuiz);

export default quizRouter;