import { Request, Response } from "express";
import {
  ApplicationError,
  EApplicationErrorType,
} from "./utils/applicationError";
import { createError } from "./utils/createError";
import { formatError } from "./utils/formatError";

const unknownErrorConfig = {
  type: EApplicationErrorType.UNKNOWN,
  name: "Unknown error",
  message: "Unknown error",
  statusCode: 500,
  errors: [],
};

export function errorMiddleware(
  err: ApplicationError | Error,
  req: Request,
  res: Response
): Response {
  let error: ApplicationError;

  if (!(err instanceof ApplicationError)) {
    error =
      err instanceof Error
        ? createError(err)
        : new ApplicationError(unknownErrorConfig);
  } else {
    error = err;
  }

  return res.status(error.statusCode).send(formatError(error));
}
