import { Router } from "express";
import courseMiddleware from "../middlewares/course.middleware";

import { authMiddleware } from "../middlewares/auth.middleware";
import { fetchLessonById, fetchLessons } from "../controllers/lesson.controller";

const lessonRouter = Router();

// For admins
lessonRouter.get("/", authMiddleware, fetchLessons);
lessonRouter.get("/:id", authMiddleware, fetchLessonById);

export default lessonRouter;