import { NextFunction, Request, Response, Router } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { GroupDA } from "../data-access/group.DA";
import { IGroup, IGroupData } from "../domain/group.domain";
import {
  GroupService,
  IAddUsersToGroupParams,
  IGroupId,
  IUpdateGroupParams,
} from "../service/group.service";
import {
  GroupSchema,
  IAddUsersToGroupRequestSchema,
  ICreateGroupRequestSchema,
  IDeleteGroupRequestSchema,
  IdsSchema,
  IGetGroupRequestSchema,
  IUpdateGroupRequestSchema,
} from "./group.controller-models";
import { useService } from "./utils/useService";
import { checkTokenMiddleware } from "../middleware/checkToken.middleware";

export const GroupController = Router();
const validator = createValidator();
const service = new GroupService(new GroupDA());

GroupController.use(checkTokenMiddleware);

GroupController.get(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    await useService<IGroup[], null>(
      res,
      next,
      service.GetGroups.bind(service)
    );
  }
);

GroupController.get(
  "/:id",
  async (
    req: ValidatedRequest<IGetGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useService<IGroup, IGroupId>(
      res,
      next,
      service.GetGroup.bind(service),
      { id }
    );
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
    const group = req.body;
    await useService<IGroup, IGroupData>(
      res,
      next,
      service.AddGroup.bind(service),
      group
    );
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
    const { id: groupId } = req.params;
    const { ids: userIds } = req.body;
    await useService<IGroup, IAddUsersToGroupParams>(
      res,
      next,
      service.AddUsersToGroup.bind(service),
      {
        groupId,
        userIds,
      }
    );
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
    const { id } = req.params;
    const group = req.body;
    await useService<IGroup, IUpdateGroupParams>(
      res,
      next,
      service.UpdateGroup.bind(service),
      {
        id,
        group,
      }
    );
  }
);

GroupController.delete(
  "/:id",
  async (
    req: ValidatedRequest<IDeleteGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useService<boolean, IGroupId>(
      res,
      next,
      service.RemoveGroup.bind(service),
      { id }
    );
  }
);
