import { UserDA } from "../DA";
import { IUser, IUserData, NoUsersFoundException } from "../types";

export class UserService {
  constructor(private userDA: UserDA) {}

  public GetUser(id: string): IUser {
    const data = this.userDA.getUserById(id);
    UserService.HidePassword(data);
    return data;
  }

  public AddUser(data: IUserData): IUser {
    const id = `f${(+new Date()).toString(16)}`;
    const result = this.userDA.createUser({
      ...data,
      id,
      isDeleted: false,
    });
    UserService.HidePassword(result);
    return result;
  }

  public UpdateUser(id: string, data: IUserData): IUser {
    const result = this.userDA.updateUser(id, data);
    UserService.HidePassword(result);
    return result;
  }

  public GetUsers(limit: number, loginSubstring: string): IUser[] {
    const data = this.userDA.getAllUsers();
    const filteredData = data.filter((user) =>
      user.login.includes(loginSubstring)
    );
    const sortedData = filteredData.sort((a, b) =>
      a.login > b.login ? 1 : a.login < b.login ? -1 : 0
    );
    if (sortedData.length > 0) {
      return sortedData
        .slice(0, limit)
        .map((user) => UserService.HidePassword(user));
    } else {
      throw new NoUsersFoundException();
    }
  }

  public RemoveUser(id: string): boolean {
    return this.userDA.deleteUser(id);
  }

  private static HidePassword(user: IUser): IUser {
    user.password = `${user.password[0]}***`;
    return user;
  }
}
