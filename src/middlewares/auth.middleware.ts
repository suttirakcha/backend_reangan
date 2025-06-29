import type { Request, Response, NextFunction } from "express";
import createError from "../utils/create-error.util";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { ICreateUser, IUser } from "../types";

export const authMiddleware = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer")) {
    throw createError(401, "Headers unauthorized");
  }

  const token = headers.split(" ")[1];
  const payload = jwt.verify(token!, process.env.JWT_SECRET!);

  const existedUser = await prisma.user.findUnique({
    where: { id: payload?.id },
  });

  if (!existedUser) {
    throw createError(404, "User not found");
  }

  const { password, createdAt, updatedAt, ...userData } = existedUser;
  (req.user as ICreateUser) = userData;

  next();
};
