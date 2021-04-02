import { NextFunction, Request, Response } from "express";
import { BaseError } from "./models";

export const errorHandler = (
  err: BaseError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err instanceof BaseError ? err.statusCode : 500;
  res.status(status).send({ message: err.message });
};
