import type { Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";

// For users
export const getAllLessons = async (req: Request, res: Response) => {
  const lessons = await prisma.lesson.findMany({
    include: { quizzes: true },
  });
  res.json({ message: "Get the lesson", lessons });
};

export const getCurrentLesson = async (req: Request, res: Response) => {
  const { courseId, lessonId, quizId } = req.params;
  const lesson = await prisma.lesson.findFirst({
    where: { courseId: +courseId },
  });

  const quiz = await prisma.quiz.findFirst({
    where: { lessonId: +lessonId, id: +quizId },
    include: { questions: true },
  });

  res.json({ message: "Get the lesson", lesson, quiz });
};

// For admins
export const fetchLessons = async (req: Request, res: Response) => {
  const lessons = await prisma.lesson.findMany();
  res.json({ message: "Lessons fetched", lessons });
};

export const fetchLessonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const lesson = await prisma.lesson.findFirst({
    where: { id: +id },
  });
  res.json({ message: "Lesson fetched", lesson });
};

export const createLesson = async (req: Request, res: Response) => {
  const { title, description, course } = req.body;

  if (!title){
    throw createError(400, "Title is required");
  }

  const lesson = await prisma.lesson.create({
    data: {
      title, 
      description,
      course
    }
  });
  res.json({ message: "Lesson fetched", lesson });
};
