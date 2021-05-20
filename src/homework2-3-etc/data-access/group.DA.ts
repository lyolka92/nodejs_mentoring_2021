import { Transaction } from "sequelize";
import { IGroupData } from "../domain/group.domain";
import { seq } from "../init/dbConnection";
import { BaseError } from "../middleware/utils/baseError";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";

interface IGroupDataAccess {
  addUsersToGroup(groupId: string, userIds: string[]): Promise<Group | void>;
  createGroup(data: IGroupData): Promise<Group | void>;
  deleteGroup(id: string): Promise<boolean | void>;
  getAllGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<Group | void>;
  updateGroup(id: string, data: IGroupData): Promise<Group | void>;
}

export class GroupDA implements IGroupDataAccess {
  public async addUsersToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<Group | void> {
    return await seq.transaction(async (t) => {
      const group = await this.getGroupById(groupId, t);
      if (group) {
        await group.addUsers(userIds, { transaction: t });
        return group;
      }
    });
  }

  public async createGroup(groupData: IGroupData): Promise<Group | void> {
    const createdGroup = await Group.create({
      name: groupData.name,
      permissions: groupData.permissions,
    });
    return await this.getGroupById(createdGroup.id);
  }

  public async deleteGroup(groupId: string): Promise<boolean | void> {
    const deletedGroupsCount = await Group.destroy({
      where: {
        id: groupId,
      },
    });

    if (!deletedGroupsCount) {
      throw new BaseError(`Group with id ${groupId} not found`, 404);
    } else {
      return !!deletedGroupsCount;
    }
  }

  public async getAllGroups(): Promise<Group[]> {
    return await Group.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }

  public async getGroupById(
    groupId: string,
    transaction?: Transaction
  ): Promise<Group | void> {
    const group = await Group.findOne({
      include: {
        model: User,
        as: "users",
        attributes: ["id", "login", "age"],
      },
      where: { id: groupId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      transaction,
    });

    if (!group) {
      throw new BaseError(`Group with id ${groupId} not found`, 404);
    } else {
      return group;
    }
  }

  public async updateGroup(
    groupId: string,
    groupData: IGroupData
  ): Promise<Group | void> {
    const { 1: updatedGroups } = await Group.update(
      {
        name: groupData.name,
        permissions: groupData.permissions,
      },
      { where: { id: groupId }, returning: true }
    );

    if (!updatedGroups.length) {
      throw new BaseError(`Group with id ${groupId} not found`, 404);
    } else {
      return this.getGroupById(updatedGroups[0].id);
    }
  }
}
