export class BaseError extends Error {
  public readonly statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
}
enum HttpStatusCode {
  NOT_FOUND = 404,
}

export class WrongUserIdException extends BaseError {
  constructor() {
    super("User not found", HttpStatusCode.NOT_FOUND);
  }
}

export class NoUsersFoundException extends BaseError {
  constructor() {
    super("Users not found", HttpStatusCode.NOT_FOUND);
  }
}
