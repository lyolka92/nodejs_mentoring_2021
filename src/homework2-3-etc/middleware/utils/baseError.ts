export interface IBaseError extends Error {
  statusCode: number;
}

export class BaseError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
