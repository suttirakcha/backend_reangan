import { Router } from "express";
import { createStatistics, getStatistics, updateStatistics } from "../controllers/stat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const statRouter = Router();

statRouter.get("/", authMiddleware, getStatistics);
statRouter.post("/", authMiddleware, createStatistics);
statRouter.patch("/", authMiddleware, updateStatistics);

export default statRouter;