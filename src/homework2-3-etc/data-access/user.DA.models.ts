import { IUser, IUserData, IUserPresentationData } from "../domain/user.domain";

export interface IUserDataAccess {
  createUser(data: IUserData): Promise<IUserPresentationData>;

  deleteUser(id: string): Promise<boolean>;

  getAllUsers(
    limit: number,
    loginSubstring: string
  ): Promise<IUserPresentationData[]>;

  getUserById(id: string): Promise<IUserPresentationData>;

  getUserByLogin(userLogin: string): Promise<IUser>;

  updateUser(id: string, data: IUserData): Promise<IUserPresentationData>;
}
