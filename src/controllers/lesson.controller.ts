import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getAllLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lessons = await prisma.lesson.findMany({
    include: { quizzes: true }
  })
  res.json({ message: "Get the quizzes", lessons });
};

export const getCurrentLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const quizzes = await prisma.quiz.findMany({
    where: { lessonId: +id },
  });

  res.json({ message: "Get the quizzes", quizzes });
};
