import {
  IUser,
  IUserData,
  IUserPresentationData,
} from "../../domain/user.domain";
import {
  IGetUsersParams,
  IUpdateUserParams,
  IUserId,
  IUserService,
} from "../user.service.models";
import { BaseError } from "../../middleware/utils/baseError";
import * as faker from "faker";

export class UserService implements IUserService {
  DB: IUser[] = [];

  public AddUser = jest
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
      return this.GetUser({ id: user.id });
    });

  public GetUser = jest.fn<Promise<IUserPresentationData>, [userId: IUserId]>(
    async ({ id: userId }) => {
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
    }
  );

  public GetUsers = jest.fn<
    Promise<IUserPresentationData[]>,
    [params: IGetUsersParams]
  >(({ limit, loginSubstring }: IGetUsersParams) => {
    const users = this.DB.filter((user) => user.login.includes(loginSubstring));

    return Promise.resolve(
      new Array(Math.min(limit, users.length)).map((_, index) => ({
        login: users[index].login,
        age: users[index].age,
        id: users[index].id,
      }))
    );
  });

  public RemoveUser = jest.fn<Promise<boolean>, [userId: IUserId]>(
    async ({ id: userId }) => {
      const user = this.DB.find((item) => item.id === userId);

      if (!user || user.isDeleted) {
        throw new BaseError(`User with id ${userId} not found`, 404);
      } else {
        user.isDeleted = true;
        return Promise.resolve(true);
      }
    }
  );

  public UpdateUser = jest.fn<
    Promise<IUserPresentationData>,
    [params: IUpdateUserParams]
  >(async ({ id: userId, data: userData }) => {
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
