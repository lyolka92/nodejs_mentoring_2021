import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { BaseError } from "./utils/baseError";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

dotenv.config();

type JwtError = JsonWebTokenError | TokenExpiredError | NotBeforeError;

export const checkTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["x-access-token"];

  if (token) {
    try {
      jwt.verify(String(token), String(process.env.JWT_SECRET));
      next();
    } catch (err) {
      const error = err as JwtError;
      next(new BaseError(error.message, 403));
    }
  } else {
    throw new BaseError("No token provided.", 401);
  }
};
