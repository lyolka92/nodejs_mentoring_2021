import { NextFunction, Request, Response, Router } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { GroupDA } from "../data-access/group.DA";
import { IGroup, IGroupData } from "../domain/group.domain";
import { GroupService } from "../service/group.service";
import {
  GroupSchema,
  IAddUsersToGroupRequestSchema,
  ICreateGroupRequestSchema,
  IDeleteGroupRequestSchema,
  IdsSchema,
  IGetGroupRequestSchema,
  IUpdateGroupRequestSchema,
} from "./group.controller.models";
import {
  useServiceWithParams,
  useServiceWithoutParams,
} from "./utils/useService";
import { IGroup, IGroupData } from "../domain/group.domain";
import { checkTokenMiddleware } from "../middleware/checkToken.middleware";
import { GroupService } from "../service/group.service";
import { checkPermissionsMiddleware } from "../middleware/checkPermissions.middleware";
import {
  IAddUsersToGroupParams,
  IGroupId,
  IUpdateGroupParams,
} from "../service/group.service.models";
import { Controller } from "./models";

export class GroupController implements Controller {
  public path = "/groups";
  public router = Router();
  public service = new GroupService(new GroupDA());
  private validator = createValidator();
  private readonly isLoggerOn: boolean;

  constructor(isLoggerOn = true) {
    this.isLoggerOn = isLoggerOn;
    this.initRouter();
  }

  private initRouter() {
    this.router.use(checkTokenMiddleware);
    this.router.use(checkPermissionsMiddleware);
    this.router.get(this.path, this.getGroups);
    this.router.get(`${this.path}/:id`, this.getGroup);
    this.router.post(
      this.path,
      this.validator.body(GroupSchema),
      this.addGroup
    );
    this.router.post(
      `${this.path}/:id/users`,
      this.validator.body(IdsSchema),
      this.addUsersToGroup
    );
    this.router.put(
      `${this.path}/:id`,
      this.validator.body(GroupSchema),
      this.updateGroup
    );
    this.router.delete(`${this.path}/:id`, this.deleteGroup);
  }

  private getGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await useServiceWithoutParams<IGroup[]>(
      res,
      next,
      this.service.GetGroups.bind(this.service),
      this.isLoggerOn
    );
  };

  private getGroup = async (
    req: ValidatedRequest<IGetGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useServiceWithParams<IGroup, IGroupId>(
      res,
      next,
      this.service.GetGroup.bind(this.service),
      { id },
      this.isLoggerOn
    );
  };

  private addGroup = async (
    req: ValidatedRequest<ICreateGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const group = req.body;
    await useServiceWithParams<IGroup, IGroupData>(
      res,
      next,
      this.service.AddGroup.bind(this.service),
      group,
      this.isLoggerOn
    );
  };

  private addUsersToGroup = async (
    req: ValidatedRequest<IAddUsersToGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id: groupId } = req.params;
    const { ids: userIds } = req.body;
    await useServiceWithParams<IGroup, IAddUsersToGroupParams>(
      res,
      next,
      this.service.AddUsersToGroup.bind(this.service),
      {
        groupId,
        userIds,
      },
      this.isLoggerOn
    );
  };

  private updateGroup = async (
    req: ValidatedRequest<IUpdateGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const group = req.body;
    await useServiceWithParams<IGroup, IUpdateGroupParams>(
      res,
      next,
      this.service.UpdateGroup.bind(this.service),
      {
        id,
        group,
      },
      this.isLoggerOn
    );
  };

  private deleteGroup = async (
    req: ValidatedRequest<IDeleteGroupRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    await useServiceWithParams<boolean, IGroupId>(
      res,
      next,
      this.service.RemoveGroup.bind(this.service),
      { id },
      this.isLoggerOn
    );
  };
}
