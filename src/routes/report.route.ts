import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { getReportById, getReports, resolveIssuesFromReport, sendReports } from "../controllers/report.controller";

const reportRouter = Router();

reportRouter.get("/", authMiddleware, getReports);
reportRouter.get("/:id", authMiddleware, getReportById);
reportRouter.post("/", authMiddleware, sendReports);
reportRouter.patch("/:id", authMiddleware, resolveIssuesFromReport);

export default reportRouter;