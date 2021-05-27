import * as faker from "faker";
import {
  IAddUsersToGroupParams,
  IGroupId,
  IGroupService,
  IUpdateGroupParams,
} from "../group.service.models";
import { IGroup, IGroupData } from "../../domain/group.domain";
import { BaseError } from "../../middleware/utils/baseError";

export class GroupService implements IGroupService {
  DB: IGroup[] = [];

  public AddGroup = jest
    .fn<Promise<IGroup>, [groupData: IGroupData]>()
    .mockImplementation(async (groupData) => {
      const group = {
        name: groupData.name,
        permissions: groupData.permissions,
        id: faker.datatype.uuid(),
      };
      this.DB.push(group);
      return this.GetGroup({ id: group.id });
    });

  public AddUsersToGroup = jest
    .fn<Promise<IGroup>, [params: IAddUsersToGroupParams]>()
    .mockImplementation(async ({ groupId }) => {
      const group = this.DB.find((item) => item.id === groupId);

      if (!group) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        return Promise.resolve(group);
      }
    });

  public GetGroup = jest.fn<Promise<IGroup>, [groupId: IGroupId]>(
    async ({ id: groupId }) => {
      const group = this.DB.find((item) => item.id === groupId);

      if (!group) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        return Promise.resolve(group);
      }
    }
  );

  public GetGroups = jest.fn<Promise<IGroup[]>, []>(() => {
    return Promise.resolve(this.DB);
  });

  public RemoveGroup = jest.fn<Promise<boolean>, [groupId: IGroupId]>(
    async ({ id: groupId }) => {
      const groupIndex = this.DB.findIndex((item) => item.id === groupId);

      if (groupIndex === -1) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        this.DB.splice(groupIndex, 1);
        return Promise.resolve(true);
      }
    }
  );

  public UpdateGroup = jest.fn<Promise<IGroup>, [params: IUpdateGroupParams]>(
    async ({ id: groupId, group: groupData }): Promise<IGroup> => {
      let group = this.DB.find((item) => item.id === groupId);

      if (!group) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        group = {
          ...group,
          ...groupData,
        };
        return Promise.resolve(group);
      }
    }
  );
}
