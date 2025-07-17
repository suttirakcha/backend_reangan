import type { Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";

export const getReports = async (req: Request, res: Response) => {
  const { role } = req.user;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can view the reports");
  }

  const reports = await prisma.report.findMany();
  res.json({ message: "Fetched the reports", reports });
};

export const getReportById = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { id } = req.params;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can view the reports");
  }

  const report = await prisma.report.findUnique({
    where: { id: +id }
  });

  if (!report){
    throw createError(404, "Report not found");
  }

  res.json({ message: "Fetched the reports", report });
};

export const sendReports = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { issue, detail, isResolved, quizId } = req.body;

  if (role === "ADMIN") {
    throw createError(403, "Only users can submit the report");
  }

  const report = await prisma.report.create({
    data: { issue, detail, isResolved, quizId },
  });

  res.json({ message: "Submitted the report", report });
};

export const resolveIssuesFromReport = async (req: Request, res: Response) => {
  const { role } = req.user;
  const { id } = req.params;

  if (role !== "ADMIN") {
    throw createError(403, "Only admins can resolve this report");
  }

  const findReport = await prisma.report.findFirst({
    where: { id: +id }
  })

  if (!findReport){
    throw createError(404, "Report not found");
  }

  const resolved = await prisma.report.update({
    where: { id: findReport?.id },
    data: { isResolved: true }
  })

  res.json({ message: "Issue has been resolved", resolved })
};
