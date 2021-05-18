import { UserDA } from "../data-access/user.DA";
import { IUserData, IUserPresentationData } from "../domain/user.domain";

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

export class UserService {
  constructor(private userDA: UserDA) {}

  public async AddUser(data: IUserData): Promise<IUserPresentationData | void> {
    return await this.userDA.createUser(data);
  }

  public async GetUser({ id }: IUserId): Promise<IUserPresentationData | void> {
    return await this.userDA.getUserById(id);
  }

  public async GetUsers({
    limit,
    loginSubstring,
  }: IGetUsersParams): Promise<IUserPresentationData[]> {
    return await this.userDA.getAllUsers(limit, loginSubstring);
  }

  public async RemoveUser({ id }: IUserId): Promise<boolean | void> {
    return await this.userDA.deleteUser(id);
  }

  public async UpdateUser({
    id,
    data,
  }: IUpdateUserParams): Promise<IUserPresentationData | void> {
    return await this.userDA.updateUser(id, data);
  }
}
