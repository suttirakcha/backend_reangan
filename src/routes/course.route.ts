import { Router } from "express";
import { getAllCourses, getCourseById } from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getCourseById);

export default courseRouter;