import { GroupDA } from "../data-access/group.DA";
import { IGroup, IGroupData } from "../domain/group.domain";

export interface IAddUsersToGroupParams {
  groupId: string;
  userIds: string[];
}

export interface IUpdateGroupParams {
  id: string;
  group: IGroupData;
}

export interface IGroupId {
  id: string;
}

export class GroupService {
  constructor(private groupDA: GroupDA) {}

  public async AddGroup(data: IGroupData): Promise<IGroup | void> {
    return await this.groupDA.createGroup(data);
  }

  public async AddUsersToGroup({
    groupId,
    userIds,
  }: IAddUsersToGroupParams): Promise<IGroup | void> {
    return await this.groupDA.addUsersToGroup(groupId, userIds);
  }

  public async GetGroup({ id }: IGroupId): Promise<IGroup | void> {
    return await this.groupDA.getGroupById(id);
  }

  public async GetGroups(): Promise<IGroup[]> {
    return await this.groupDA.getAllGroups();
  }

  public async RemoveGroup({ id }: IGroupId): Promise<boolean | void> {
    return await this.groupDA.deleteGroup(id);
  }

  public async UpdateGroup({
    id,
    group,
  }: IUpdateGroupParams): Promise<IGroup | void> {
    return await this.groupDA.updateGroup(id, group);
  }
}
