import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { fetchQuiz } from "../services/quiz.service";
import createError from "../utils/create-error.util";

// For users
export const getAllQuizzes = async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  const quizzes = await prisma.quiz.findMany({
    include: { questions: true },
    omit: { lessonId: true },
  });
  res.json({ message: "Get the quizzes", quizzes });
};

export const getCurrentQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await fetchQuiz(+id);

  res.json({ message: "Get the quiz", lessonId: +id, quiz });
};

export const getFinishedQuizzes = async (req: Request, res: Response) => {
  const { role } = req.user;

  if (role === "ADMIN"){
    throw createError(403, "Only users can access finished quiizes");
  }

  const finishedQuizzes = await prisma.finishedQuiz.findMany();

  res.json({ message: "Found finished quizzes", finishedQuizzes })
}

export const completeQuiz = async (req: Request, res: Response) => {
  const { courseId, lessonId, quizId } = req.params;
  const { id: userId } = req.user;
  const quiz = await fetchQuiz(+lessonId, +quizId);

  const findFinishedQuiz = await prisma.finishedQuiz.findMany({
    where: { userId, courseId: +courseId, quizId: +quizId }
  })

  if (findFinishedQuiz?.length > 0){
    res.json({ message: "Already completed" });
    return;
  };

  const completed = await prisma.finishedQuiz.create({
    data: {
      userId,
      courseId: +courseId,
      quizId: +quiz!.id
    }
  })

  res.json({ message: "Quiz completed", completed })
};

// For admins

export const createQuiz = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { title, lessonId } = req.body;

  if (role !== "ADMIN"){
    throw createError(403, "Only admins can create the quiz");
  }

  const quiz = await prisma.quiz.create({
    data: { title, lessonId }
  })

  res.json({ message: "Quiz created", quiz })
}

export const updateQuiz = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { id } = req.params
  const { title } = req.body;

  if (role !== "ADMIN"){
    throw createError(403, "Only admins can create the quiz");
  }

  const quiz = await prisma.quiz.update({
    where: { id: +id },
    data: { title }
  })

  res.json({ message: "Quiz updated", quiz })
}

export const deleteQuiz = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { id } = req.params

  if (role !== "ADMIN"){
    throw createError(403, "Only admins can create the quiz");
  }

  await prisma.quiz.delete({
    where: { id: +id },
  })

  res.json({ message: "Quiz deleted" })
}