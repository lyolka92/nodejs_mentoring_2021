import { Router, Response, NextFunction } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access/user.DA";
import { UserService } from "../service/user.service";
import {
  ICreateUserRequestSchema,
  IDeleteUserRequestSchema,
  IGetUserRequestSchema,
  IGetUsersRequestSchema,
  IUpdateUserRequestSchema,
  UserSchema,
} from "./user.controller-models";
import { createError } from "../middleware/utils/createError";

export const UserController = Router();
const validator = createValidator();
const service = new UserService(new UserDA());

UserController.get(
  "",
  async (
    req: ValidatedRequest<IGetUsersRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit, loginSubstring } = req.query;
      const data = await service.GetUsers(limit, loginSubstring);
      res.status(200).json(data);
    } catch (err) {
      next(createError(err));
    }
  }
);

UserController.get(
  "/:id",
  async (
    req: ValidatedRequest<IGetUserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await service.GetUser(id);
      res.status(200).json(data);
    } catch (err) {
      next(createError(err));
    }
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
    try {
      const user = req.body;
      const data = await service.AddUser(user);
      res.status(200).json(data);
    } catch (err) {
      next(createError(err));
    }
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
    try {
      const { id } = req.params;
      const user = req.body;
      const data = await service.UpdateUser(id, user);
      res.status(200).json(data);
    } catch (err) {
      next(createError(err));
    }
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
    try {
      const result = await service.RemoveUser(id);
      res
        .status(200)
        .send(`User is ${result ? "successfully" : "not"} deleted`);
    } catch (err) {
      next(createError(err));
    }
  }
);
