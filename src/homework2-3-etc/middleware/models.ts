export class BaseError extends Error {
  public readonly statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
}

export enum HttpStatusCode {
  NOT_FOUND = 404,
}
