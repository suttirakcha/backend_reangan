import type { Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";

// For users
export const getAllLessons = async (req: Request, res: Response) => {
  const lessons = await prisma.lesson.findMany({
    include: { quizzes: { include: { questions: true } } },
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
export const fetchLessonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can access this lesson");
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: +id },
  });
  res.json({ message: "Lesson fetched", lesson });
};

export const createLesson = async (req: Request, res: Response) => {
  const { title, description, courseId } = req.body;
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the lessons");
  }

  if (!title) {
    throw createError(400, "Title is required");
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      description,
      courseId,
    },
  });
  res.json({ message: "Lesson created", lesson });
};

export const updateLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, courseId } = req.body;
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the lessons");
  }

  if (!title) {
    throw createError(400, "Title is required");
  }

  const findLesson = await prisma.lesson.findFirst({
    where: { id: +id },
  });

  if (!findLesson) {
    throw createError(400, "Failed to update a course");
  }

  const lesson = await prisma.lesson.update({
    where: { id: findLesson?.id },
    data: {
      title,
      description,
      courseId,
    },
  });
  res.json({ message: "Lesson updated", lesson });
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the lessons");
  }

  const findLesson = await prisma.lesson.findFirst({
    where: { id: +id },
  });

  if (!findLesson) {
    throw createError(400, "Failed to update a course");
  }

  await prisma.lesson.delete({
    where: { id: findLesson?.id },
  });

  res.json({ message: "Lesson fetched" });
};
