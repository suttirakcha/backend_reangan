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

export const generateToken = (payload: any, expiresIn?: string) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "5s",
  });

  return token;
};
