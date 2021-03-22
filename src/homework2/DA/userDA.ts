import { users } from "./userData";
import {
  IUser,
  IUserData,
  IUserDataAccess,
  NoUsersFoundException,
  WrongUserIdException,
} from "../types";

export class UserDAFromFile implements IUserDataAccess {
  public createUser(user: IUser): IUser {
    users.push(user);
    return user;
  }

  public deleteUser(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!(user instanceof Error)) {
      const userIndex = users.indexOf(user);
      users[userIndex] = {
        ...user,
        isDeleted: true,
      };
      return true;
    }
  }

  public getAllUsers(): IUser[] {
    const result = users.filter((user) => !user.isDeleted);
    if (result.length > 0) {
      return result;
    } else {
      throw new NoUsersFoundException();
    }
  }

  public getUserById(id: string): IUser {
    const user = users.find((user) => user.id === id && !user.isDeleted);
    if (user) {
      return user;
    } else {
      throw new WrongUserIdException();
    }
  }

  public updateUser(userId: string, userData: IUserData): IUser {
    const user = this.getUserById(userId);
    if (!(user instanceof Error)) {
      const userIndex = users.indexOf(user);
      users[userIndex] = {
        ...user,
        ...userData,
      };
      return users[userIndex];
    }
  }
}
