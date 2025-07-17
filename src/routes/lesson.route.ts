import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { fetchLessonById, createLesson, getAllLessons, updateLesson, deleteLesson } from "../controllers/lesson.controller";

const lessonRouter = Router();

// For admins
lessonRouter.get("/", authMiddleware, getAllLessons)
lessonRouter.get("/:id", authMiddleware, fetchLessonById);
lessonRouter.post("/", authMiddleware, createLesson);
lessonRouter.patch("/:id", authMiddleware, updateLesson);
lessonRouter.delete("/:id", authMiddleware, deleteLesson);

export default lessonRouter;