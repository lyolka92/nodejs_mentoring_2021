import { Router, Response, NextFunction } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access/user.DA";
import { IUserData, IUserPresentationData } from "../domain/user.domain";
import { UserService } from "../service/user.service";
import { useService } from "./utils/useService";
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
} from "./user.controller-models";
import { useService } from "./utils/useService";
import { checkTokenMiddleware } from "../middleware/checkToken.middleware";
import { checkPermissionsMiddleware } from "../middleware/checkPermissions.middleware";

export const UserController = Router();
const validator = createValidator();
const service = new UserService(new UserDA());

UserController.use(checkTokenMiddleware);
UserController.use(checkPermissionsMiddleware);

UserController.get(
  "",
  async (
    req: ValidatedRequest<IGetUsersRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { limit, loginSubstring } = req.query;
    await useService<IUserPresentationData[], IGetUsersParams>(
      res,
      next,
      service.GetUsers.bind(service),
      {
        limit,
        loginSubstring,
      }
    );
  }
);

UserController.get(
  "/:id",
  async (
    req: ValidatedRequest<IGetUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useService<IUserPresentationData, IUserId>(
      res,
      next,
      service.GetUser.bind(service),
      {
        id,
      }
    );
  }
);

UserController.post(
  "",
  validator.body(UserSchema),
  async (
    req: ValidatedRequest<ICreateUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.body;
    await useService<IUserPresentationData, IUserData>(
      res,
      next,
      service.AddUser.bind(service),
      user
    );
  }
);

UserController.put(
  "/:id",
  validator.body(UserSchema),
  async (
    req: ValidatedRequest<IUpdateUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const data = req.body;
    await useService<IUserPresentationData, IUpdateUserParams>(
      res,
      next,
      service.UpdateUser.bind(service),
      { id, data }
    );
  }
);

UserController.delete(
  "/:id",
  async (
    req: ValidatedRequest<IDeleteUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useService<boolean, IUserId>(
      res,
      next,
      service.RemoveUser.bind(service),
      {
        id,
      }
    );
  }
);
