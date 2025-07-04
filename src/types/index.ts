import { JwtPayload } from "jsonwebtoken";

export type ErrorType = Error & { statusCode?: number };

export interface ICreateUser {
  id: number;
  username: string;
  email: string;
}

export interface IUser extends ICreateUser {
  password: string;
  createdAt: string;
  updatedAt: string;
  enrolledCourses: ICourse[]
}

export interface ICourse {
  id: number;
  title: string;
  description: string | null;
}

export interface IQuiz {
  id: number;
  title: string;
  questions: IQuestion[]
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
}

declare global {
  namespace Express {
    interface Request {
      user: IUser,
      enrolledCourse: IEnrolledCourse
    }
  }
}