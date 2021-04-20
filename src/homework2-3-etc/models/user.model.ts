import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { IUser as IUserAttributes } from "../domain/user.domain";
import { seq } from "../init/dbConnection";

type TUserCreationAttributes = Optional<IUserAttributes, "id">;

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
    },
  },
  {
    sequelize: seq,
    tableName: "users",
  }
);
