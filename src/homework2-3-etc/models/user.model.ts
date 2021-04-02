import { Optional } from "sequelize";
import { Column, Table, Model } from "sequelize-typescript";
import { IUser } from "../domain";

type UserCreationAttributes = Optional<IUser, "id">;

@Table
export class user extends Model<IUser, UserCreationAttributes> {
  @Column
  age: number;

  @Column
  isDeleted: boolean;

  @Column
  login: string;

  @Column
  password: string;
}
