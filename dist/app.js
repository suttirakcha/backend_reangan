import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import authRouter from "./routes/auth.route.js";
import courseRouter from "./routes/course.route.js";
const app = express();
app.use(express.json());
app.use(cors());
// TODO: routes for backend
app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;
