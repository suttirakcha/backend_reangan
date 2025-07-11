import { Router } from "express";
import courseMiddleware from "../middlewares/course.middleware";

import { authMiddleware } from "../middlewares/auth.middleware";
import { getAllLessons, getCurrentLessons } from "../controllers/lesson.controller";

const lessonRouter = Router();

// For admins
lessonRouter.get("/", authMiddleware, getAllLessons);
lessonRouter.get("/:id", authMiddleware, getCurrentLessons);

export default lessonRouter;