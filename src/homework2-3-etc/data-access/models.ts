import { IUserData, IUserPresentationData } from "../domain";

export interface IUserDataAccess {
  createUser(data: IUserData): Promise<IUserPresentationData>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]>;
  getUserById(id: number): Promise<IUserPresentationData>;
  updateUser(id: number, data: IUserData): Promise<IUserPresentationData>;
}
