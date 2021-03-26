import { BaseError } from "../types/user.exceptions";
import { NextFunction, Request, Response } from "express";

export const unknownRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.route) {
    return next(new BaseError(`Unknown route ${String(req.route)}`, 404));
  }
  next();
};
