export interface IUser extends IUserData {
  id: number;
  isDeleted: boolean;
}

export interface IUserData {
  age: number;
  login: string;
  password: string;
}

export type IUserPresentationData = Omit<IUser, "isDeleted" | "password">;
