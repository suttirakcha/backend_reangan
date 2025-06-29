import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        omit: { courseId: true },
      },
    },
  });

  res.json({ message: "Courses fetched", courses });
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const course = await prisma.course.findFirst({
    where: { id },
    include: {
      lessons: {
        omit: { courseId: true },
      },
    },
  });

  if (!course) {
    throw createError(404, "Course not found");
  }

  res.json({ message: "Courses fetched", course });
};
