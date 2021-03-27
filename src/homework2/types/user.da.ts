import { IUser } from "./user.domain";

export interface IUserDataAccess {
  createUser(data: IUser): IUser;

  deleteUser(id: string): boolean;

  getAllUsers(): IUser[];

  getUserById(id: string): IUser;

  updateUser(id: string, data: IUser): IUser;
}
