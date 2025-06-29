import type { Request, Response } from "express";

const notFoundMiddleware = (req: Request, res: Response) => {
  res
    .status(404)
    .json({
      message: `Request: not found ${req.method} ${req.url} on this server`,
    });
};

export default notFoundMiddleware;
