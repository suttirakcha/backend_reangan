import type { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllLessons = async (req: Request, res: Response) => {
  const lessons = await prisma.lesson.findMany({
    include: { quizzes: true },
  });
  res.json({ message: "Get the lesson", lessons });
};

export const getCurrentLessons = async (req: Request, res: Response) => {
  const { courseId, lessonId, quizId } = req.params;
  const lesson = await prisma.lesson.findFirst({
    where: { courseId: +courseId },
  });

  const quiz = await prisma.quiz.findFirst({
    where: { lessonId: +lessonId, id: +quizId },
    include: { questions: true }
  })

  res.json({ message: "Get the lesson", lesson, quiz });
};
