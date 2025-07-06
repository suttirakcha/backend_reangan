import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

export const getUser = async (username: string, email?: string) => {
  return await prisma.user.findFirst({
    where: { username, email },
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

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "30d",
  });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "15d",
  });
};
