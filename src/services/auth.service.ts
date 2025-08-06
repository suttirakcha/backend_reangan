import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

export const getUser = async (username: string, email?: string) => {
  return await prisma.user.findFirst({
    where: { username, email },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findFirst({
    where: { id },
  });
};

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
    omit: {
      password: true,
    },
  });
};

export const generateAccessToken = (payload: unknown) => {
  return jwt.sign(payload!, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "15m", // Will set to approx. 10-15 mins to avoid hackers that try to steal the token
  });
};

export const generateRefreshToken = (payload: unknown) => {
  return jwt.sign(payload!, process.env.REFRESH_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "30d", // Will set to 15-30 days and the system will send the new accessToken for every 15-30 days
  });
};
