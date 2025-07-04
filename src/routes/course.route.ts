import { Router } from "express";
import { enrollCourse, getAllCourses, getCourseById, getEnrolledCourses, getLessonFromCourse, unenrollCourse } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import courseMiddleware from "../middlewares/course.middleware";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/enrolled", authMiddleware, courseMiddleware, getEnrolledCourses);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/:id", authMiddleware, enrollCourse);
courseRouter.delete("/:id", authMiddleware, unenrollCourse);
courseRouter.use('/:id/lessons', authMiddleware, courseMiddleware, getLessonFromCourse);

export default courseRouter;