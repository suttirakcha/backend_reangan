import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import createError from "../utils/create-error.util";

const validate =
  (schema: z.infer<any>, options: any = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parse(req.body, { abortEarly: false, ...options });
      req.body = result;
      next();
    } catch (err: any) {
      const errors = err.errors.map((error: any) => error.message);
      throw createError(400, errors.join(","));
    }
  };

export default validate;
