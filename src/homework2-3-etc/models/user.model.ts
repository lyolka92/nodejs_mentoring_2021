import { DataTypes, Optional, Model } from "sequelize";
import { seq } from "../data-access/dbConnection";
import { IUser } from "../domain";

type UserCreationAttributes = Optional<IUser, "id">;

export class User
  extends Model<IUser, UserCreationAttributes>
  implements IUser {
  public id!: number;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
