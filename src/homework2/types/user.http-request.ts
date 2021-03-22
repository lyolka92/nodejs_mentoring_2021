import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface IGetUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface IGetUsersRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    limit: number;
    loginSubstring: string;
  };
}

export interface ICreateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    user: {
      login: string;
      password: string;
      age: number;
    };
  };
}

export interface IUpdateUserRequestSchema extends ICreateUserRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface IDeleteUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}
