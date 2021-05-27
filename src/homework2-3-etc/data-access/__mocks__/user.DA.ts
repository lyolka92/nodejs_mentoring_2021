import {
  IUser,
  IUserData,
  IUserPresentationData,
} from "../../domain/user.domain";
import { IUserDataAccess } from "../user.DA.models";
import { BaseError } from "../../middleware/utils/baseError";
import * as faker from "faker";

export class UserDA implements IUserDataAccess {
  DB: IUser[] = [];

  public createUser = jest
    .fn<Promise<IUserPresentationData>, [userData: IUserData]>()
    .mockImplementation(async (userData) => {
      const user = {
        login: userData.login,
        age: userData.age,
        password: userData.password,
        id: faker.datatype.uuid(),
        isDeleted: false,
      };
      this.DB.push(user);
      return this.getUserById(user.id);
    });

  public getUserById = jest.fn<
    Promise<IUserPresentationData>,
    [userId: string]
  >(async (userId) => {
    const user = this.DB.find((item) => item.id === userId);

    if (!user || user.isDeleted) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      const userData = {
        login: user.login,
        age: user.age,
        id: user.id,
      };
      return Promise.resolve(userData);
    }
  });

  public getUserByLogin = jest.fn<Promise<IUser>, [userLogin: string]>(
    async (userLogin) => {
      const user = this.DB.find((item) => item.id === userLogin);

      if (!user || user.isDeleted) {
        throw new BaseError(`User with id ${userLogin} not found`, 404);
      } else {
        return Promise.resolve(user);
      }
    }
  );

  public getAllUsers = jest.fn<
    Promise<IUserPresentationData[]>,
    [limit: number, loginSubstring: string]
  >((limit, loginSubstring) => {
    const users = this.DB.filter((user) => user.login.includes(loginSubstring));

    return Promise.resolve(
      new Array(Math.min(limit, users.length)).map((_, index) => ({
        login: users[index].login,
        age: users[index].age,
        id: users[index].id,
      }))
    );
  });

  public deleteUser = jest.fn<Promise<boolean>, [userId: string]>(
    async (userId) => {
      const user = this.DB.find((item) => item.id === userId);

      if (!user || user.isDeleted) {
        throw new BaseError(`User with id ${userId} not found`, 404);
      } else {
        user.isDeleted = true;
        return Promise.resolve(true);
      }
    }
  );

  public updateUser = jest.fn<
    Promise<IUserPresentationData>,
    [userId: string, userData: IUserData]
  >(async (userId, userData) => {
    let user = this.DB.find((item) => item.id === userId);

    if (!user || user.isDeleted) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      user = {
        ...user,
        ...userData,
      };
      const userPresentationData = {
        login: user.login,
        age: user.age,
        id: user.id,
      };
      return Promise.resolve(userPresentationData);
    }
  });
}
