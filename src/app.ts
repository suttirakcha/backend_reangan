import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/not-found.middleware";
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import userRouter from "./routes/user.route";

const app = express();

app.use(express.json());
app.use(cors());

// TODO: routes for backend

app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use('/users', userRouter);

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;
