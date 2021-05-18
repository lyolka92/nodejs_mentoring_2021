import { IApplicationError } from "./applicationError";

interface IFormattedError extends Error {
  stack: string;
}

export function formatError(error: IApplicationError): IFormattedError {
  return {
    ...error,
    stack: JSON.stringify(error.stack) || "",
  };
}
