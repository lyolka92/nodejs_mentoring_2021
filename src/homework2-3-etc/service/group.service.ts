import { GroupDA } from "../data-access/group.DA";
import { IGroup, IGroupData } from "../domain/group.domain";
import {
  IAddUsersToGroupParams,
  IGroupId,
  IGroupService,
  IUpdateGroupParams,
} from "./group.service.models";

export class GroupService implements IGroupService {
  constructor(private groupDA: GroupDA) {}

  public async AddGroup(data: IGroupData): Promise<IGroup> {
    return await this.groupDA.createGroup(data);
  }

  public async AddUsersToGroup({
    groupId,
    userIds,
  }: IAddUsersToGroupParams): Promise<IGroup> {
    return await this.groupDA.addUsersToGroup(groupId, userIds);
  }

  public async GetGroup({ id }: IGroupId): Promise<IGroup> {
    return await this.groupDA.getGroupById(id);
  }

  public async GetGroups(): Promise<IGroup[]> {
    return await this.groupDA.getAllGroups();
  }

  public async RemoveGroup({ id }: IGroupId): Promise<boolean> {
    return await this.groupDA.deleteGroup(id);
  }

  public async UpdateGroup({ id, group }: IUpdateGroupParams): Promise<IGroup> {
    return await this.groupDA.updateGroup(id, group);
  }
}
