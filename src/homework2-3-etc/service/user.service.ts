import { IUserData, IUserPresentationData } from "../domain/user.domain";
import {
  IGetUsersParams,
  IUpdateUserParams,
  IUserId,
  IUserService,
} from "./user.service.models";
import { UserDA } from "../data-access/user.DA";

export class UserService implements IUserService {
  constructor(private userDA: UserDA) {}

  public async AddUser(data: IUserData): Promise<IUserPresentationData> {
    return await this.userDA.createUser(data);
  }

  public async GetUser({ id }: IUserId): Promise<IUserPresentationData> {
    return await this.userDA.getUserById(id);
  }

  public async GetUsers({
    limit,
    loginSubstring,
  }: IGetUsersParams): Promise<IUserPresentationData[]> {
    return await this.userDA.getAllUsers(limit, loginSubstring);
  }

  public async RemoveUser({ id }: IUserId): Promise<boolean> {
    return await this.userDA.deleteUser(id);
  }

  public async UpdateUser({
    id,
    data,
  }: IUpdateUserParams): Promise<IUserPresentationData> {
    return await this.userDA.updateUser(id, data);
  }
}
