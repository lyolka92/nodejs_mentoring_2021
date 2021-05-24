import { Op } from "sequelize";
import {
  IUserData,
  IUserPresentationData,
  IUserWithGroups,
} from "../domain/user.domain";
import { User } from "../models/user.model";
import { BaseError } from "../middleware/utils/baseError";
import { IUserDataAccess } from "./user.DA.models";

export class UserDA implements IUserDataAccess {
  public async createUser(userData: IUserData): Promise<IUserPresentationData> {
    const createdUser = await User.create({
      age: userData.age,
      login: userData.login,
      password: userData.password,
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

  public async getUserById(userId: string): Promise<IUserPresentationData> {
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

  public async getUserByLogin(userLogin: string): Promise<IUserWithGroups> {
    const user = await User.findOne({
      where: { login: userLogin },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: Group,
        as: "groups",
        attributes: ["permissions"],
      },
    });

    if (!user || user.isDeleted) {
      throw new BaseError("Bad login/password combination", 401);
    } else {
      return user;
    }
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

    if (!updatedUsers.length) {
      throw new BaseError(`User with id ${userId} not found`, 404);
    } else {
      return this.getUserById(updatedUsers[0].id);
    }
  }
}
