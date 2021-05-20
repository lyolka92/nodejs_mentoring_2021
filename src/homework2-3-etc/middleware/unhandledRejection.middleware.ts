import { NextFunction, Request, Response } from "express";

export const unhandledRejectionMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`Unhandled rejection: ${err.message}`);
  next(err);
};
