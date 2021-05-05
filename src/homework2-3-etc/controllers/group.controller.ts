import { NextFunction, Request, Response, Router } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { GroupService } from "../service/group.service";
import { GroupDA } from "../data-access/group.DA";
import {
  GroupSchema,
  IAddUsersToGroupRequestSchema,
  ICreateGroupRequestSchema,
  IDeleteGroupRequestSchema,
  IdsSchema,
  IGetGroupRequestSchema,
  IUpdateGroupRequestSchema,
} from "./group.controller-models";
import { createError } from "../middleware/utils/createError";

export const GroupController = Router();
const validator = createValidator();
const service = new GroupService(new GroupDA());

GroupController.get(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.GetGroups();
      res.status(200).json(data);
    } catch (err) {
      return next(createError(err));
    }
  }
);

GroupController.get(
  "/:id",
  async (
    req: ValidatedRequest<IGetGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const data = await service.GetGroup(id);
      res.status(200).json(data);
    } catch (err) {
      return next(createError(err));
    }
  }
);

GroupController.post(
  "",
  validator.body(GroupSchema),
  async (
    req: ValidatedRequest<ICreateGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const group = req.body;
      const data = await service.AddGroup(group);
      res.status(200).json(data);
    } catch (err) {
      return next(createError(err));
    }
  }
);

GroupController.post(
  "/:id/users",
  validator.body(IdsSchema),
  async (
    req: ValidatedRequest<IAddUsersToGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: groupId } = req.params;
      const { ids: userIds } = req.body;
      const data = await service.AddUsersToGroup(groupId, userIds);
      res.status(200).json(data);
    } catch (err) {
      return next(createError(err));
    }
  }
);

GroupController.put(
  "/:id",
  validator.body(GroupSchema),
  async (
    req: ValidatedRequest<IUpdateGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const group = req.body;
      const data = await service.UpdateGroup(id, group);
      res.status(200).json(data);
    } catch (err) {
      return next(createError(err));
    }
  }
);

GroupController.delete(
  "/:id",
  async (
    req: ValidatedRequest<IDeleteGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await service.RemoveGroup(id);
      res
        .status(200)
        .send(`Group is ${result ? "successfully" : "not"} deleted`);
    } catch (err) {
      return next(createError(err));
    }
  }
);
