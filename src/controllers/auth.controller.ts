import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import createError from "../utils/create-error.util";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  createUser,
  generateAccessToken,
  generateRefreshToken,
  getUser,
} from "../services/auth.service";
import prisma from "../config/prisma";
import sendEmail from "../utils/send-mail.util";

export const register = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
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
    role: user?.role
  };

  if (!comparePassword) {
    throw createError(400, "Password is incorrect");
  }

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    })
    .json({
      message: "Logged in successfully",
      result: payload,
      accessToken,
      refreshToken,
    });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const existedEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (!existedEmail) {
    throw createError(404, "Email not found");
  }

  const resetPasswordToken = jwt.sign(
    existedEmail,
    process.env.RESET_PASSWORD_SECRET!,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );

  // const mainUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetPasswordToken}`;
  const mainUrl = `${req.protocol}://localhost:5173/reset-password/${resetPasswordToken}`;
  sendEmail(email, mainUrl);

  res.json({
    message: "Request has sent to reset password",
    resetPasswordToken
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const occurError = () => {
    throw createError(
      400,
      "An error occurred while trying to reset password, please try again."
    );
  };

  if (!token) {
    occurError();
  }

  const verifyToken = jwt.verify(token!, process.env.RESET_PASSWORD_SECRET!, {
    algorithms: ["HS256"],
  });

  if (!verifyToken) {
    occurError();
  }

  const decoded = jwt.decode(token!);
  const hashPassword = await bcrypt.hash(password, 10);

  if (decoded && typeof decoded === "object" && "id" in decoded) {
    await prisma.user.update({
      where: { id: decoded?.id },
      data: {
        password: hashPassword,
      },
    });
  } else {
    occurError();
  }

  res.json({ message: "Successfully reset password", password: hashPassword });
};
