import { Group } from "../models/group.model";
import { IGroupData } from "../domain/group.domain";

export interface IGroupDataAccess {
  addUsersToGroup(groupId: string, userIds: string[]): Promise<Group>;

  createGroup(data: IGroupData): Promise<Group>;

  deleteGroup(id: string): Promise<boolean>;

  getAllGroups(): Promise<Group[]>;

  getGroupById(id: string): Promise<Group>;

  updateGroup(id: string, data: IGroupData): Promise<Group>;
}
