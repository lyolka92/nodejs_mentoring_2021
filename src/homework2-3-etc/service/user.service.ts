import { UserDA } from "../data-access";
import { IUserData, IUserPresentationData } from "../domain";
import { user as userModel } from "../models";

export class UserService {
  constructor(private userDA: UserDA) {}

  public async AddUser(data: IUserData): Promise<IUserPresentationData> {
    const result = await this.userDA.createUser(data);
    return UserService.HideServiceData(result);
  }

  public async GetUser(id: string): Promise<IUserPresentationData> {
    const data = await this.userDA.getUserById(id);
    return UserService.HideServiceData(data);
  }

  public async GetUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]> {
    const data = await this.userDA.getAllUsers();
    const filteredData = data.filter((user) =>
      user.login.includes(loginSubstring)
    );
    const sortedData = filteredData.sort((a, b) =>
      a.login > b.login ? 1 : a.login < b.login ? -1 : 0
    );
    return sortedData
      .slice(0, limit)
      .map((user) => UserService.HideServiceData(user));
  }

  public async RemoveUser(id: string): Promise<boolean> {
    return await this.userDA.deleteUser(id);
  }

  public async UpdateUser(
    id: string,
    data: IUserData
  ): Promise<IUserPresentationData> {
    const result = await this.userDA.updateUser(id, data);
    return UserService.HideServiceData(result);
  }

  private static HideServiceData(userData: userModel): IUserPresentationData {
    return {
      id: userData.id,
      login: userData.login,
      age: userData.age,
    };
  }
}
