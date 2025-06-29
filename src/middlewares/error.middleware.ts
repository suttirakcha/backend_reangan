import type { Request, Response, NextFunction } from "express";
import { ErrorType } from "../types";

const errorMiddleware = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
};

export default errorMiddleware;
