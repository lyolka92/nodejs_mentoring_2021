import { IGroup, IGroupData } from "../domain/group.domain";

export interface IGroupService {
  AddGroup: (data: IGroupData) => Promise<IGroup>;
  AddUsersToGroup: (params: IAddUsersToGroupParams) => Promise<IGroup>;
  GetGroup: (params: IGroupId) => Promise<IGroup>;
  RemoveGroup: (params: IGroupId) => Promise<boolean>;
  UpdateGroup: (params: IUpdateGroupParams) => Promise<IGroup>;
}

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
