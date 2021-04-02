import { NextFunction, Request, Response } from "express";
import { BaseError, HttpStatusCode } from "./models";

export const unknownRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.route) {
    return next(
      new BaseError(
        `Unknown route ${String(req.route)}`,
        HttpStatusCode.NOT_FOUND
      )
    );
  }
  next();
};
