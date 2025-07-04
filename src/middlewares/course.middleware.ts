import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import { IEnrolledCourse } from "../types";

const courseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const enrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { userId: +id }
  });

  if (!enrolledCourse) {
    throw createError(401, "You have not enrolled any courses yet");
  }

  (req.enrolledCourse as IEnrolledCourse | null) = enrolledCourse;
  next();
};

export default courseMiddleware;
