import { Transaction } from "sequelize";
import { IGroupData } from "../domain/group.domain";
import { seq } from "../init/dbConnection";
import { BaseError } from "../middleware/utils/baseError";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { IGroupDataAccess } from "./group.DA.models";

export class GroupDA implements IGroupDataAccess {
  public async addUsersToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<Group> {
    return await seq.transaction(async (t) => {
      const group = await this.getGroupById(groupId, t);
      await group.addUsers(userIds, { transaction: t });
      return group;
    });
  }

  public async createGroup(groupData: IGroupData): Promise<Group> {
    const createdGroup = await Group.create({
      name: groupData.name,
      permissions: groupData.permissions,
    });
    return await this.getGroupById(createdGroup.id);
  }

  public async deleteGroup(groupId: string): Promise<boolean> {
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
  ): Promise<Group> {
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
  ): Promise<Group> {
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
