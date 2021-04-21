import { Op } from "sequelize";
import { IUserData, IUserPresentationData } from "../domain/user.domain";
import { User } from "../models/user.model";

interface IUserDataAccess {
  createUser(data: IUserData): Promise<IUserPresentationData>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]>;
  getUserById(id: string): Promise<IUserPresentationData>;
  updateUser(id: string, data: IUserData): Promise<IUserPresentationData>;
}

export class UserDA implements IUserDataAccess {
  public async createUser(userData: IUserData): Promise<IUserPresentationData> {
    const createdUser = await User.create({
      age: userData.age,
      login: userData.login,
      password: userData.password,
      isDeleted: false,
    });
    return await this.getUserById(createdUser.id);
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const [updatedUserCount] = await User.update(
      { isDeleted: true },
      {
        where: {
          id: userId,
          isDeleted: false,
        },
      }
    );
    return !!updatedUserCount;
  }

  public async getAllUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]> {
    return await User.findAll({
      where: { isDeleted: false, login: { [Op.substring]: loginSubstring } },
      order: [["login", "DESC"]],
      limit,
      attributes: {
        exclude: ["password", "isDeleted", "createdAt", "updatedAt"],
      },
    });
  }

  public async getUserById(userId: string): Promise<IUserPresentationData> {
    return await User.findOne({
      where: { id: userId, isDeleted: false },
      attributes: {
        exclude: ["password", "isDeleted", "createdAt", "updatedAt"],
      },
    });
  }

  public async updateUser(
    userId: string,
    userData: IUserData
  ): Promise<IUserPresentationData> {
    const { 1: updatedUsers } = await User.update(
      { login: userData.login, password: userData.password, age: userData.age },
      {
        where: {
          id: userId,
          isDeleted: false,
        },
        returning: true,
      }
    );
    return this.getUserById(updatedUsers[0].id);
  }
}
