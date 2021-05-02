import { GroupDA } from "../data-access/group.DA";
import { IGroup, IGroupData } from "../domain/group.domain";

export class GroupService {
  constructor(private groupDA: GroupDA) {}

  public async AddGroup(data: IGroupData): Promise<IGroup> {
    return await this.groupDA.createGroup(data);
  }

  public async AddUsersToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<IGroup> {
    return await this.groupDA.addUsersToGroup(groupId, userIds);
  }

  public async GetGroup(id: string): Promise<IGroup> {
    return await this.groupDA.getGroupById(id);
  }

  public async GetGroups(): Promise<IGroup[]> {
    return await this.groupDA.getAllGroups();
  }

  public async RemoveGroup(id: string): Promise<boolean> {
    return await this.groupDA.deleteGroup(id);
  }

  public async UpdateGroup(id: string, data: IGroupData): Promise<IGroup> {
    return await this.groupDA.updateGroup(id, data);
  }
}
