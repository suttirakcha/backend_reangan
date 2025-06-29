import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export const getLessonFromCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lessons = await prisma.lesson.findMany();

  res.json({ message: "Lessons fetched", lessons });
};