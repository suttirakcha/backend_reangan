import { Router } from "express";
import { enrollCourse, getAllCourses, getEnrolledCourses, getLessonFromCourse, unenrollCourse } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import courseMiddleware from "../middlewares/course.middleware";
import { getCurrentLesson } from "../controllers/lesson.controller";
import { completeQuiz, getAllQuizzes, getCurrentQuiz } from "../controllers/quiz.controller";

const courseRouter = Router();

// For fetching all courses
courseRouter.get("/", getAllCourses);

// For enrolling or unenrolling courses
courseRouter.post("/:id", authMiddleware, enrollCourse);
courseRouter.delete("/:id", authMiddleware, unenrollCourse);

// For fetching enrolled courses
courseRouter.get("/enrolled", authMiddleware, courseMiddleware, getEnrolledCourses);
courseRouter.get('/:id/lessons', authMiddleware, courseMiddleware, getLessonFromCourse);

courseRouter.get('/:courseId/lessons/:lessonId/quiz', authMiddleware, courseMiddleware, getAllQuizzes);
courseRouter.get('/:courseId/lessons/:lessonId/quiz/:quizId', authMiddleware, courseMiddleware, getCurrentLesson);
courseRouter.post('/:courseId/lessons/:lessonId/quiz/:quizId', authMiddleware, courseMiddleware, completeQuiz);

export default courseRouter;