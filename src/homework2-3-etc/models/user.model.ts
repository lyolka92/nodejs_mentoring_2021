import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { IUser as IUserAttributes } from "../domain/user.domain";
import { seq } from "../init/dbConnection";
import { Group } from "./group.model";

type TUserCreationAttributes = Optional<IUserAttributes, "id" | "isDeleted">;

export class User
  extends Model<IUserAttributes, TUserCreationAttributes>
  implements IUserAttributes {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public groups?: Group[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    login: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: seq,
    tableName: "users",
  }
);
