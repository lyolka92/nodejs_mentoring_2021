import { UserDA } from "../DA";
import { IUser, IUserData, IUserPresentationData } from "../types";

export class UserService {
  constructor(private userDA: UserDA) {}

  public GetUser(id: string): IUserPresentationData {
    const data = this.userDA.getUserById(id);
    return UserService.HideServiceData(data);
  }

  public AddUser(data: IUserData): IUserPresentationData {
    const id = `f${(+new Date()).toString(16)}`;
    const result = this.userDA.createUser({
      ...data,
      id,
      isDeleted: false,
    });
    return UserService.HideServiceData(result);
  }

  public UpdateUser(id: string, data: IUserData): IUserPresentationData {
    const result = this.userDA.updateUser(id, data);
    return UserService.HideServiceData(result);
  }

  public GetUsers(
    limit: number,
    loginSubstring: string
  ): IUserPresentationData[] {
    const data = this.userDA.getAllUsers();
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

  public RemoveUser(id: string): boolean {
    return this.userDA.deleteUser(id);
  }

  private static HideServiceData(user: IUser): IUserPresentationData {
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.isDeleted;
    return safeUser;
  }
}
