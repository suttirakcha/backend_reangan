import prisma from "../config/prisma";

export const fetchQuiz = async (lessonId: number, quizId?: number) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, lessonId },
    include: { questions: true },
    omit: { lessonId: true },
  });

  return quiz;
};