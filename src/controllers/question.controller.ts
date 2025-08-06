import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { fetchQuiz } from "../services/quiz.service";
import createError from "../utils/create-error.util";

export const createQuestion = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { question, correct_answer, choices, quizId } = req.body;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the quiz");
  }

  const createdQuestion = await prisma.questions.create({
    data: { question, correct_answer, choices, quizId },
  });

  res.json({ message: "Question created", question: createdQuestion });
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user;
  const { question, correct_answer, choices, quizId } = req.body;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the quiz");
  }

  const findQuestion = await prisma.questions.findFirst({
    where: { id: +id },
  });

  if (!findQuestion) {
    throw createError(404, "Question not found");
  }

  const updatedQuestion = await prisma.questions.update({
    where: { id: findQuestion?.id },
    data: { question, correct_answer, choices, quizId },
  });

  res.json({ message: "Question updated", question: updatedQuestion });
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can create the quiz");
  }

  const findQuestion = await prisma.questions.findFirst({
    where: { id: +id },
  });

  if (!findQuestion) {
    throw createError(404, "Question not found");
  }

  await prisma.questions.delete({
    where: { id: findQuestion?.id }
  });

  res.json({ message: "Question deleted" });
};
