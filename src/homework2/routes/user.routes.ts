import { Router, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserDA } from "../DA";
import { UserService } from "../service";
import {
  ICreateUserRequestSchema,
  IDeleteUserRequestSchema,
  IGetUserRequestSchema,
  IGetUsersRequestSchema,
  IUpdateUserRequestSchema,
  UserSchema,
} from "../types";

export const UserController = Router();
const validator = createValidator();
const service = new UserService(new UserDA());

UserController.get(
  "",
  (req: ValidatedRequest<IGetUsersRequestSchema>, res: Response) => {
    const { limit, loginSubstring } = req.query;
    const data = service.GetUsers(limit, loginSubstring);
    res.status(200).json(data);
  }
);

UserController.get(
  "/:id",
  (req: ValidatedRequest<IGetUserRequestSchema>, res: Response) => {
    const { id } = req.params;
    const data = service.GetUser(id);
    res.status(200).json(data);
  }
);

UserController.post(
  "",
  validator.body(UserSchema),
  (req: ValidatedRequest<ICreateUserRequestSchema>, res: Response) => {
    const user = req.body;
    const data = service.AddUser(user);
    res.status(200).json(data);
  }
);

UserController.put(
  "/:id",
  validator.body(UserSchema),
  (req: ValidatedRequest<IUpdateUserRequestSchema>, res: Response) => {
    const { id } = req.params;
    const user = req.body;
    const data = service.UpdateUser(id, user);
    res.status(200).json(data);
  }
);

UserController.delete(
  "/:id",
  (req: ValidatedRequest<IDeleteUserRequestSchema>, res: Response) => {
    const { id } = req.params;
    service.RemoveUser(id);
    res.status(200).send("User is successfully deleted");
  }
);
