export interface IUser extends IUserData {
  id: string;
  isDeleted: boolean;
}

export interface IUserData {
  age: number;
  login: string;
  password: string;
}

export type IUserPresentationData = Omit<IUser, "isDeleted" | "password">;
