import { IGroup, IGroupData } from "../../domain/group.domain";
import { BaseError } from "../../middleware/utils/baseError";
import * as faker from "faker";

interface IGroupDataAccessMock {
  addUsersToGroup(groupId: string, userIds: string[]): Promise<IGroupWithUsers>;
  createGroup(data: IGroupData): Promise<IGroup>;
  deleteGroup(id: string): Promise<boolean>;
  getAllGroups(): Promise<IGroup[]>;
  getGroupById(id: string): Promise<IGroup>;
  updateGroup(id: string, data: IGroupData): Promise<IGroup>;
}

interface IGroupUsers {
  groupId: string;
  userIds: string[];
}

interface IGroupWithUsers extends IGroup {
  groupUsers: string[];
}

export class GroupDA implements IGroupDataAccessMock {
  groupDB: IGroup[] = [];
  groupUsersDB: IGroupUsers[] = [];

  public createGroup = jest
    .fn<Promise<IGroup>, [groupData: IGroupData]>()
    .mockImplementation(async (groupData) => {
      const group = {
        name: groupData.name,
        permissions: groupData.permissions,
        id: faker.datatype.uuid(),
      };
      this.groupDB.push(group);
      return Promise.resolve(group);
    });

  public getGroupById = jest.fn<Promise<IGroup>, [groupId: string]>(
    async (groupId) => {
      const group = this.groupDB.find((item) => item.id === groupId);

      if (!group) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        return Promise.resolve(group);
      }
    }
  );

  public getAllGroups = jest.fn<Promise<IGroup[]>, []>(() => {
    return Promise.resolve(this.groupDB);
  });

  public deleteGroup = jest.fn<Promise<boolean>, [groupId: string]>(
    async (groupId) => {
      const groupIndex = this.groupDB.findIndex((item) => item.id === groupId);

      if (groupIndex === -1) {
        throw new BaseError(`Group with id ${groupId} not found`, 404);
      } else {
        this.groupDB.splice(groupIndex, 1);
        return Promise.resolve(true);
      }
    }
  );

  public updateGroup = jest.fn<
    Promise<IGroup>,
    [groupId: string, groupData: IGroupData]
  >(async (groupId, groupData) => {
    let group = this.groupDB.find((item) => item.id === groupId);

    if (!group) {
      throw new BaseError(`Group with id ${groupId} not found`, 404);
    } else {
      group = {
        ...group,
        ...groupData,
      };
      return Promise.resolve(group);
    }
  });

  public addUsersToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<IGroupWithUsers> {
    const group = this.groupDB.find((item) => item.id === groupId);

    if (!group) {
      throw new BaseError(`Group with id ${groupId} not found`, 404);
    } else {
      const groupUsersObject = this.groupUsersDB.find(
        (item) => item.groupId === group.id
      );

      if (groupUsersObject) {
        const usersUnion = [...groupUsersObject.userIds, ...userIds];
        groupUsersObject.userIds = usersUnion.filter(
          (item, pos) => usersUnion.indexOf(item) === pos
        );
      } else {
        this.groupUsersDB.push({ groupId, userIds });
      }

      return Promise.resolve(this.getGroupUsers(group));
    }
  }

  private getGroupUsers(group: IGroup): IGroupWithUsers {
    const groupUsersObject = this.groupUsersDB.find(
      (item) => item.groupId === group.id
    );

    if (groupUsersObject) {
      return {
        ...group,
        groupUsers: groupUsersObject.userIds,
      };
    } else {
      throw new BaseError(`Group with id ${group.id} has no users`, 404);
    }
  }
}
