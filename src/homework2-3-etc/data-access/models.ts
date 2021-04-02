import { user } from "../models";
import { IUserData } from "../domain";

export interface IUserDataAccess {
  createUser(data: IUserData): Promise<user>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<user[]>;
  getUserById(id: string): Promise<user>;
  updateUser(id: string, data: IUserData): Promise<user>;
}
