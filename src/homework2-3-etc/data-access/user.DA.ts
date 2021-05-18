import { Op } from "sequelize";
import { IUserData, IUserPresentationData } from "../domain/user.domain";
import { User } from "../models/user.model";
import { BaseError } from "../middleware/utils/baseError";

interface IUserDataAccess {
  createUser(data: IUserData): Promise<IUserPresentationData | void>;
  deleteUser(id: string): Promise<boolean | void>;
  getAllUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]>;
  getUserById(id: string): Promise<IUserPresentationData | void>;
  updateUser(
    id: string,
    data: IUserData
  ): Promise<IUserPresentationData | void>;
}

export class UserDA implements IUserDataAccess {
  public async createUser(
    userData: IUserData
  ): Promise<IUserPresentationData | void> {
    const createdUser = await User.create({
      age: userData.age,
      login: userData.login,
      password: userData.password,
    });
    return await this.getUserById(createdUser.id);
  }

  public async deleteUser(userId: string): Promise<boolean | void> {
    const [updatedUserCount] = await User.update(
      { isDeleted: true },
      {
        where: {
          id: userId,
          isDeleted: false,
        },
      }
    );

    if (!updatedUserCount) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      return !!updatedUserCount;
    }
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

  public async getUserById(
    userId: string
  ): Promise<IUserPresentationData | void> {
    const user = await User.findOne({
      where: { id: userId, isDeleted: false },
      attributes: {
        exclude: ["password", "isDeleted", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      return user;
    }
  }

  public async updateUser(
    userId: string,
    userData: IUserData
  ): Promise<IUserPresentationData | void> {
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

    if (!updatedUsers.length) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      return this.getUserById(updatedUsers[0].id);
    }
  }
}
