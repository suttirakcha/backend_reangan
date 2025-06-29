import { JwtPayload } from "jsonwebtoken";

export type ErrorType = Error & { statusCode?: number };

export interface ICreateUser {
  id: string | JwtPayload;
  username: string;
  email: string;
}

export interface IUser extends ICreateUser {
  password: string;
  createdAt: string;
  updatedAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}