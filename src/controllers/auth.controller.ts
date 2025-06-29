import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  const existedUser = await prisma.user.findFirst({
    where: { username, email },
  });

  if (existedUser) {
    throw createError(
      400,
      "This user already exists. Please try another username"
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
    },
    omit: {
      password: true,
    },
  });

  res.json({ message: "Registered successfully", result: user });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError(400, "Invalid email or password");
  }

  const comparePassword = await bcrypt.compare(password, user?.password!);
  const payload = {
    id: user?.id,
    email: user?.email,
    username: user?.username,
  };

  if (!comparePassword) {
    throw createError(400, "Password is incorrect");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  res.json({ message: "Logged in successfully", result: payload, token });
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.user;
  res.json({ message: "User found", result: { username, email } });
};
