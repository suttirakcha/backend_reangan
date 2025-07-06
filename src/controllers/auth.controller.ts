import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import createError from "../utils/create-error.util";
import jwt from "jsonwebtoken";
import { createUser, generateAccessToken, generateRefreshToken, getUser } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  const existedUser = await getUser(username);

  if (existedUser) {
    throw createError(
      400,
      "This user already exists. Please try another username"
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, email, hashPassword);

  res.json({ message: "Registered successfully", result: user });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  const user = await getUser(username, email);

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

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  }).json({ message: "Logged in successfully", result: payload, accessToken, refreshToken });
};