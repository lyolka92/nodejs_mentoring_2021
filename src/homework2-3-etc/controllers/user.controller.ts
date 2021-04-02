import { Router, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../data-access";
import { UserService } from "../service";
import {
  ICreateUserRequestSchema,
  IDeleteUserRequestSchema,
  IGetUserRequestSchema,
  IGetUsersRequestSchema,
  IUpdateUserRequestSchema,
  UserSchema,
} from "./models";

export const UserController = Router();
const validator = createValidator();
const service = new UserService(new UserDA());

UserController.get(
  "",
  async (req: ValidatedRequest<IGetUsersRequestSchema>, res: Response) => {
    try {
      const { limit, loginSubstring } = req.query;
      const data = await service.GetUsers(limit, loginSubstring);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

UserController.get(
  "/:id",
  async (req: ValidatedRequest<IGetUserRequestSchema>, res: Response) => {
    try {
      const { id } = req.params;
      const data = await service.GetUser(id);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

UserController.post(
  "",
  validator.body(UserSchema),
  async (req: ValidatedRequest<ICreateUserRequestSchema>, res: Response) => {
    try {
      const user = req.body;
      const data = await service.AddUser(user);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

UserController.put(
  "/:id",
  validator.body(UserSchema),
  async (req: ValidatedRequest<IUpdateUserRequestSchema>, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.body;
      const data = await service.UpdateUser(id, user);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

UserController.delete(
  "/:id",
  async (req: ValidatedRequest<IDeleteUserRequestSchema>, res: Response) => {
    try {
      const { id } = req.params;
      const result = await service.RemoveUser(id);
      res
        .status(200)
        .send(`User is ${result ? "successfully" : "not"} deleted`);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
