import { Router } from "express";
import { getAllCourses, getCourseById } from "../controllers/course.controller.js";
const courseRouter = Router();
courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getCourseById);
export default courseRouter;
