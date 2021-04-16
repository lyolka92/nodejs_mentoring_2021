import { UserDA } from "../data-access";
import { IUserData, IUserPresentationData } from "../domain";

export class UserService {
  constructor(private userDA: UserDA) {}

  public async AddUser(data: IUserData): Promise<IUserPresentationData> {
    return await this.userDA.createUser(data);
  }

  public async GetUser(id: string): Promise<IUserPresentationData> {
    return await this.userDA.getUserById(Number(id));
  }

  public async GetUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]> {
    return await this.userDA.getAllUsers(limit, loginSubstring);
  }

  public async RemoveUser(id: string): Promise<boolean> {
    return await this.userDA.deleteUser(Number(id));
  }

  public async UpdateUser(
    id: string,
    data: IUserData
  ): Promise<IUserPresentationData> {
    return await this.userDA.updateUser(Number(id), data);
  }
}
