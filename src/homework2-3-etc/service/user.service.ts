import { UserDA } from "../data-access/user.DA";
import { IUserData, IUserPresentationData } from "../domain/user.domain";

export class UserService {
  constructor(private userDA: UserDA) {}

  public async AddUser(data: IUserData): Promise<IUserPresentationData> {
    return await this.userDA.createUser(data);
  }

  public async GetUser(id: string): Promise<IUserPresentationData> {
    return await this.userDA.getUserById(id);
  }

  public async GetUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]> {
    return await this.userDA.getAllUsers(limit, loginSubstring);
  }

  public async RemoveUser(id: string): Promise<boolean> {
    return await this.userDA.deleteUser(id);
  }

  public async UpdateUser(
    id: string,
    data: IUserData
  ): Promise<IUserPresentationData> {
    return await this.userDA.updateUser(id, data);
  }
}
