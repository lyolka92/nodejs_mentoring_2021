import {
  Association,
  BelongsToManyAddAssociationsMixin,
  DataTypes,
  Model,
  Optional,
  UUIDV4,
} from "sequelize";
import { EPermission, IGroup } from "../domain/group.domain";
import { seq } from "../init/dbConnection";
import { User } from "./user.model";

type TGroupCreationAttributes = Optional<IGroup, "id">;

export class Group
  extends Model<IGroup, TGroupCreationAttributes>
  implements IGroup {
  public id!: string;
  public name!: string;
  public permissions!: Array<EPermission>;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addUsers!: BelongsToManyAddAssociationsMixin<User, string>;

  public users?: User[] | User["id"][];

  public static associations: {
    users: Association<Group, User>;
  };
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...Object.keys(EPermission))),
      allowNull: false,
    },
  },
  {
    sequelize: seq,
    tableName: "groups",
  }
);

User.belongsToMany(Group, {
  through: "UserGroup",
  as: "groups",
  timestamps: false,
});
Group.belongsToMany(User, {
  through: "UserGroup",
  as: "users",
  timestamps: false,
});
