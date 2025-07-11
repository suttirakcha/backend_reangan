import type { Request, Response, NextFunction } from "express";
import createError from "../utils/create-error.util";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../types";
import prisma from "../config/prisma";

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

  if (!token) {
    throw createError(401, "Invalid token");
  }

  jwt.verify(
    token!,
    process.env.ACCESS_TOKEN_SECRET!,
    async (error: any, decode: any) => {
      if (error) throw createError(401, "Invalid credentials");

      const user = await prisma.user.findUnique({ where: { id: decode.id } });
      if (!user) throw createError(404, "User not found");

      req.user = decode;
      next();
    }
  );
};
