import { IUserData } from "../domain";
import { user } from "../models";
import { seq } from "./dbConnection";
import { IUserDataAccess } from "./models";

export class UserDA implements IUserDataAccess {
  constructor() {
    seq.addModels([user]);
  }

  public async createUser(userData: IUserData): Promise<user> {
    return await user.create({
      age: userData.age,
      login: userData.login,
      password: userData.password,
      isDeleted: false,
    });
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const result = await user.update(
      { isDeleted: true },
      {
        where: {
          id: userId,
          isDeleted: false,
        },
      }
    );
    const [updatedUserCount] = result;
    return Boolean(updatedUserCount);
  }

  public async getAllUsers(): Promise<user[]> {
    return await user.findAll({ where: { isDeleted: false } });
  }

  public async getUserById(userId: string): Promise<user> {
    return await user.findOne({ where: { id: userId, isDeleted: false } });
  }

  public async updateUser(userId: string, userData: IUserData): Promise<user> {
    const result = await user.update(
      { login: userData.login, password: userData.password, age: userData.age },
      {
        where: {
          id: userId,
          isDeleted: false,
        },
        returning: true,
      }
    );
    const updatedUserList = result[1];
    return updatedUserList[0];
  }
}
