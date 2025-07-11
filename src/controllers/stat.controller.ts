import { Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import { getUserById } from "../services/auth.service";

export const getStatistics = async (req: Request, res: Response) => {
  const { id } = req.user;
  const user = await getUserById(id);

  if (!user) {
    throw createError(404, "User not found");
  }

  const statistics = await prisma.statistics.findFirst({
    where: { userId: +id },
  });

  if (!statistics) {
    throw createError(404, "Statistics not found");
  }

  res.json({ message: "Statistics found", statistics });
};

export const createStatistics = async (req: Request, res: Response) => {
  const { id } = req.user;

  const initialStat = await prisma.statistics.create({
    data: {
      userId: id,
      correct_answered: 0,
      incorrect_answered: 0,
      exp: 0,
    },
  });

  res.json({ message: "Statistics created", initialStat });
};

export const updateStatistics = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { exp, correct_answered, incorrect_answered } = req.body;

  const statData = await prisma.statistics.update({
    where: { id },
    data: {
      userId: id,
      correct_answered,
      incorrect_answered,
      exp
    }
  })

  res.json({ message: "Statistics updated", statData });
};
