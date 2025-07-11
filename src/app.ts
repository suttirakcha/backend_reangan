import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/not-found.middleware";
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import userRouter from "./routes/user.route";
import lessonRouter from "./routes/lesson.route";
import createError from "./utils/create-error.util";
import { generateAccessToken } from "./services/auth.service";
import quizRouter from "./routes/quiz.route";
import statRouter from "./routes/stat.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// TODO: routes for backend

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/statistics', statRouter);

// Todo: Refresh token route, will do later
app.post('/refresh', (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) throw createError(401, "Invalid token");

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (error: any, decode: any) => {
    if (error) throw createError(403, "Forbidden");
    const newAccessToken = generateAccessToken(decode);
    res.json({ message: "Done", accessToken: newAccessToken })
  })
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;
