import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { IEnrolledCourse } from "../types";

const courseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  console.log(req.user);
  const enrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { userId: +id }
  });

  if (!enrolledCourse) {
    res.json({ message: "You have not enrolled any courses yet" });
    return;
  }

  (req.enrolledCourse as IEnrolledCourse | null) = enrolledCourse;
  next();
};

export default courseMiddleware;
