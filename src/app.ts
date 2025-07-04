import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/not-found.middleware";
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import userRouter from "./routes/user.route";
import lessonRouter from "./routes/lesson.route";

const app = express();

app.use(express.json());
app.use(cors());

// TODO: routes for backend

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;
