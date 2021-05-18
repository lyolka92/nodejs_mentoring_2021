import { ValidationErrorItem } from "joi";
import { IBaseError } from "./baseError";

export enum EApplicationErrorType {
  INTERNAL = "INTERNAL",
  UNKNOWN = "UNKNOWN",
  VALIDATION = "VALIDATION",
}

export interface IApplicationErrorOptions extends IBaseError {
  type: EApplicationErrorType;
  errors: string[] | ValidationErrorItem[];
}

export interface IApplicationError extends IApplicationErrorOptions {
  name: string;
}

export class ApplicationError extends Error implements IApplicationError {
  public name: string;
  public type: EApplicationErrorType;
  public message: string;
  public errors: string[] | ValidationErrorItem[];
  public statusCode: number;

  constructor(options: IApplicationErrorOptions) {
    super();
    Object.assign(options);

    if (Object.values(EApplicationErrorType).includes(options.type)) {
      throw new Error(`ApplicationError: ${options.type} is not a valid type.`);
    }

    if (!options.message) {
      throw new Error("ApplicationError: error message required.");
    }

    this.name = "ApplicationError";
    this.type = options.type || EApplicationErrorType.INTERNAL;
    this.message = options.message || "Internal server error";
    this.errors = options.errors;
    this.statusCode = options.statusCode || 500;
  }
}
