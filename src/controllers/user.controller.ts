import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import bcrypt from "bcryptjs";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.user;
  res.json({ message: "User found", result: { username, email } });
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const { username, email, current_password, new_password } = req.body;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw createError(400, "Invalid user");
  }

  // const data = {
  //   username,
  //   email
  // }

  const result = await prisma.user.update({
    where: { id },
    data: { username, email }
  })

  // console.log(user);

  // const enteredPassword = (current_password && new_password);

  // TODO: Will add the feature to change password
  // if (enteredPassword) {
  //   const checkOldPassword = await bcrypt.compare(
  //     current_password,
  //     user?.password
  //   );
  //   if (!checkOldPassword) {
  //     createError(400, "Current password is incorrect");
  //   }
  // }

  // const data = {
  //   username,
  //   email,
  //   password: enteredPassword && await bcrypt.hash(new_password, 10),
  // };

  // const result = await prisma.user.update({
  //   where: { username },
  //   data,
  //   omit: { password: true }
  // });

  // console.log(result);

  res.json({ message: "Your account has been updated", result });
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw createError(400, "Invalid user");
  }

  if (user.id === id) {
    await prisma.user.delete({
      where: { id },
    });
  }

  res.json({ message: "Your account has been deleted" });
};
