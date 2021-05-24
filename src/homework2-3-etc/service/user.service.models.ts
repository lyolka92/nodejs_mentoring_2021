import { IUserData, IUserPresentationData } from "../domain/user.domain";

export interface IUserService {
  AddUser: (data: IUserData) => Promise<IUserPresentationData>;
  GetUser: (params: IUserId) => Promise<IUserPresentationData>;
  GetUsers: (params: IGetUsersParams) => Promise<IUserPresentationData[]>;
  RemoveUser: (params: IUserId) => Promise<boolean>;
  UpdateUser: (params: IUpdateUserParams) => Promise<IUserPresentationData>;
}

export interface IUserId {
  id: string;
}

export interface IGetUsersParams {
  limit: number;
  loginSubstring: string;
}

export interface IUpdateUserParams {
  id: string;
  data: IUserData;
}
