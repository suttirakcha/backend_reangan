import { Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import bcrypt from "bcryptjs";

export const getMe = async (req: Request, res: Response) => {
  const { id, username, email } = req.user;
  res.json({ message: "User found", result: { id, username, email } });
};

export const updateAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw createError(400, "User unauthenticated");
  }

  const { username, email, current_password, new_password } = req.body;

  const existedUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existedUser) {
    throw createError(404, "User not found");
  }

  if (username && username !== existedUser.username) {
    const userWithSameUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (userWithSameUsername) {
      throw createError(400, "Username already taken");
    }
  }

  if (username && email) {
    const existedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existedUser && existedUser!.id !== userId) {
      throw createError(400, "Username or email already taken");
    }
  }

  const enteredPassword = current_password && new_password;

  if (enteredPassword) {
    const checkOldPassword = await bcrypt.compare(
      current_password,
      existedUser?.password
    );
    if (!checkOldPassword) {
      throw createError(400, "Current password is incorrect");
    }
  }

  const data = enteredPassword
    ? {
        username,
        email,
        password: enteredPassword && (await bcrypt.hash(new_password, 10)),
      }
    : {
        username,
        email,
      };

  const result = await prisma.user.update({
    where: { id: userId },
    data,
    omit: { password: true },
  });

  res.json({ message: "Your account has been updated", result });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw createError(400, "Invalid user");
  }

  await prisma.user.delete({
    where: { id },
  });

  res.json({ message: "Your account has been deleted" });
};
