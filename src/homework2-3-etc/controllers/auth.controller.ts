import { NextFunction, Response, Router } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access/user.DA";
import { IUserCredentials } from "../domain/auth.domain";
import { AuthService } from "../service/auth.service";
import { AuthSchema, IAuthRequestSchema } from "./auth.controller.models";
import { useService } from "./utils/useService";

export const AuthController = Router();
const validator = createValidator();
const service = new AuthService(new UserDA());

AuthController.post(
  "",
  validator.body(AuthSchema),
  async (
    req: ValidatedRequest<IAuthRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const userCredentials = req.body;
    await useService<string, IUserCredentials>(
      res,
      next,
      service.AuthenticateUser.bind(service),
      userCredentials
    );
  }
);
