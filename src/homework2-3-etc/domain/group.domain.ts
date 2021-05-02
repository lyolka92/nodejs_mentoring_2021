export enum EPermission {
  READ = "READ",
  WRITE = "WRITE",
  DELETE = "DELETE",
  SHARE = "SHARE",
  UPLOAD_FILES = "UPLOAD_FILES",
}

export interface IGroupData {
  name: string;
  permissions: Array<EPermission>;
}

export interface IGroup extends IGroupData {
  id: string;
}
