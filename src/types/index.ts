import { JwtPayload } from "jsonwebtoken";

export type ErrorType = Error & { statusCode?: number };

export interface ICreateUser {
  id: number;
  username: string;
  email: string;
}

export interface IUser extends ICreateUser {
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  enrolledCourses: ICourse[];
}

export interface ICourse {
  id: number;
  title: string;
  description: string | null;
  enrolledCourses: ICourse[];
}

export interface IQuiz {
  id: number;
  title: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id: number;
  question: string;
  correct_answer: string | number;
}

export interface IEnrolledCourse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: Date;
}

export interface IPayload {
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      enrolledCourse: IEnrolledCourse;
    }
  }
}
