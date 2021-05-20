import * as Joi from "joi";
import {
  ApplicationError,
  EApplicationErrorType,
  IApplicationErrorOptions,
} from "./applicationError";

export function createError(
  error: IApplicationErrorOptions | Joi.ValidationError | Error
): ApplicationError {
  const isJoiError = error instanceof Joi.ValidationError;
  if (isJoiError) {
    const joiError = mapJoiValidationError(error as Joi.ValidationError);
    return new ApplicationError(joiError);
  }
  return new ApplicationError(error as IApplicationErrorOptions);
}

function mapJoiValidationError(
  error: Joi.ValidationError
): IApplicationErrorOptions {
  return {
    name: "Validation error",
    type: EApplicationErrorType.VALIDATION,
    message: error.message,
    errors: error.details,
    stack: error.stack,
    statusCode: 400,
  };
}
