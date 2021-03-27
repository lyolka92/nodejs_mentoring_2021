import { users } from "./userData";
import {
  IUser,
  IUserData,
  IUserDataAccess,
  WrongUserIdException,
} from "../types";

export class UserDAFromFile implements IUserDataAccess {
  public createUser(user: IUser): IUser {
    users.push(user);
    return user;
  }

  public deleteUser(userId: string): boolean {
    const user = this.getUserById(userId);
    user.isDeleted = true;
    return true;
  }

  public getAllUsers(): IUser[] {
    return users.filter((user) => !user.isDeleted);
  }

  public getUserById(id: string): IUser {
    const user = users.find((user) => user.id === id && !user.isDeleted);
    if (!user) {
      throw new WrongUserIdException();
    }
    return user;
  }

  public updateUser(userId: string, userData: IUserData): IUser {
    const user = this.getUserById(userId);
    Object.assign(user, userData);
    return user;
  }
}
