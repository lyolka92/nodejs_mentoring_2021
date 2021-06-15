import { AuthSchema, IAuthRequestSchema } from "./auth.controller.models";
import { NextFunction, Response, Router } from "express";
import { ValidatedRequest, createValidator } from "express-joi-validation";
import { AuthService } from "../service/auth.service";
import { Controller } from "./models";
import { IUserCredentials } from "../domain/auth.domain";
import { UserDA } from "../data-access/user.DA";
import { useServiceWithParams } from "./utils/useService";

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
