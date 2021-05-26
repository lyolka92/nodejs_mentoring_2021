import { Router, Response, NextFunction } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access/user.DA";
import { IUserData, IUserPresentationData } from "../domain/user.domain";
import { UserService } from "../service/user.service";
import { useServiceWithParams } from "./utils/useService";
import { checkTokenMiddleware } from "../middleware/checkToken.middleware";
import {
  ICreateUserRequestSchema,
  IDeleteUserRequestSchema,
  IGetUserRequestSchema,
  IGetUsersRequestSchema,
  IUpdateUserRequestSchema,
  UserSchema,
} from "./user.controller.models";
import {
  IGetUsersParams,
  IUpdateUserParams,
  IUserId,
} from "../service/user.service.models";
import { Controller } from "./models";
} from "./user.controller-models";
import { useService } from "./utils/useService";
import { checkTokenMiddleware } from "../middleware/checkToken.middleware";
import { checkPermissionsMiddleware } from "../middleware/checkPermissions.middleware";

export class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private service = new UserService(new UserDA());
  private validator = createValidator();
  private readonly isLoggerOn: boolean;

  constructor(isLoggerOn = true) {
    this.isLoggerOn = isLoggerOn;
    this.initRouter();
  }

  private initRouter() {
    this.router.use(checkTokenMiddleware);
    this.router.use(checkPermissionsMiddleware);
    this.router.get(this.path, this.getUsers);
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.post(this.path, this.validator.body(UserSchema), this.addUser);
    this.router.put(
      `${this.path}/:id`,
      this.validator.body(UserSchema),
      this.updateUser
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private getUsers = async (
    req: ValidatedRequest<IGetUsersRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { limit, loginSubstring } = req.query;
    await useServiceWithParams<IUserPresentationData[], IGetUsersParams>(
      res,
      next,
      this.service.GetUsers.bind(this.service),
      {
        limit,
        loginSubstring,
      },
      this.isLoggerOn
    );
  };

  private getUser = async (
    req: ValidatedRequest<IGetUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useServiceWithParams<IUserPresentationData, IUserId>(
      res,
      next,
      this.service.GetUser.bind(this.service),
      {
        id,
      },
      this.isLoggerOn
    );
  };

  private addUser = async (
    req: ValidatedRequest<ICreateUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.body;
    await useServiceWithParams<IUserPresentationData, IUserData>(
      res,
      next,
      this.service.AddUser.bind(this.service),
      user,
      this.isLoggerOn
    );
  };

  private updateUser = async (
    req: ValidatedRequest<IUpdateUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const data = req.body;
    await useServiceWithParams<IUserPresentationData, IUpdateUserParams>(
      res,
      next,
      this.service.UpdateUser.bind(this.service),
      { id, data },
      this.isLoggerOn
    );
  };

  private deleteUser = async (
    req: ValidatedRequest<IDeleteUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useServiceWithParams<boolean, IUserId>(
      res,
      next,
      this.service.RemoveUser.bind(this.service),
      {
        id,
      },
      this.isLoggerOn
    );
  };
}
