import { NextFunction, Response, Router } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access/user.DA";
import { IUserCredentials } from "../domain/auth.domain";
import { AuthService } from "../service/auth.service";
import { AuthSchema, IAuthRequestSchema } from "./auth.controller.models";
import { useServiceWithParams } from "./utils/useService";
import { Controller } from "./models";

export class AuthController implements Controller {
  public path = "/authenticate";
  public router = Router();
  public service = new AuthService(new UserDA());
  private validator = createValidator();
  private readonly isLoggerOn: boolean;

  constructor(isLoggerOn = true) {
    this.isLoggerOn = isLoggerOn;
    this.initRouter();
  }

  private initRouter() {
    this.router.post(
      this.path,
      this.validator.body(AuthSchema),
      this.authenticateUser
    );
  }

  private authenticateUser = async (
    req: ValidatedRequest<IAuthRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const userCredentials = req.body;
    await useServiceWithParams<string, IUserCredentials>(
      res,
      next,
      this.service.AuthenticateUser.bind(this.service),
      userCredentials,
      this.isLoggerOn
    );
  };
}
