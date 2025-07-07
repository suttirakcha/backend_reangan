import type { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllLessons = async (
  req: Request,
  res: Response
) => {
  const lessons = await prisma.lesson.findMany({
    include: { quizzes: true }
  })
  res.json({ message: "Get the quizzes", lessons });
};

export const getCurrentLessons = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const quizzes = await prisma.quiz.findMany({
    where: { lessonId: +id },
  });

  res.json({ message: "Get the quizzes", quizzes });
};
