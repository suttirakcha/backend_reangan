import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getAllQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const quizzes = await prisma.quiz.findMany();
  res.json({ message: "Get the quizzes", quizzes });
};

export const getCurrentQuizzes = async (
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
