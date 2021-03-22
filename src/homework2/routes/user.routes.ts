import { Router, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserService } from "../service";
import {
  ICreateUserRequestSchema,
  IDeleteUserRequestSchema,
  IGetUserRequestSchema,
  IGetUsersRequestSchema,
  IUpdateUserRequestSchema,
  UserSchema,
} from "../types";

export const UserRouter = (router: Router, service: UserService): void => {
  const validator = createValidator();

  router.get(
    "/users",
    (req: ValidatedRequest<IGetUsersRequestSchema>, res: Response) => {
      try {
        const { limit, loginSubstring } = req.query;
        const data = service.GetUsers(limit, loginSubstring);
        res.status(200).json(data);
      } catch (err) {
        res.status(err.statusCode || 500).send(`Error: ${err.message}`);
      }
    }
  );

  router.get(
    "/users/:id",
    (req: ValidatedRequest<IGetUserRequestSchema>, res: Response) => {
      try {
        const { id } = req.params;
        const data = service.GetUser(id);
        res.status(200).json(data);
      } catch (err) {
        res.status(err.statusCode || 500).send(`Error: ${err.message}`);
      }
    }
  );

  router.post(
    "/users",
    validator.body(UserSchema),
    (req: ValidatedRequest<ICreateUserRequestSchema>, res: Response) => {
      try {
        const { user } = req.body;
        const data = service.AddUser(user);
        res.status(200).json(data);
      } catch (err) {
        res.status(err.statusCode || 500).send(`Error: ${err.message}`);
      }
    }
  );

  router.put(
    "/users/:id",
    validator.body(UserSchema),
    (req: ValidatedRequest<IUpdateUserRequestSchema>, res: Response) => {
      try {
        const { id } = req.params;
        const { user } = req.body;
        const data = service.UpdateUser(id, user);
        res.status(200).json(data);
      } catch (err) {
        res.status(err.statusCode || 500).send(`Error: ${err.message}`);
      }
    }
  );

  router.delete(
    "/users/:id",
    (req: ValidatedRequest<IDeleteUserRequestSchema>, res: Response) => {
      try {
        const { id } = req.params;
        service.RemoveUser(id);
        res.status(200).send("User is successfully deleted");
      } catch (err) {
        res.status(err.statusCode || 500).send(`Error: ${err.message}`);
      }
    }
  );
};
