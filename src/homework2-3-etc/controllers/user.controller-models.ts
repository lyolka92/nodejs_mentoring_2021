import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import * as Joi from "joi";

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
    login: string;
    password: string;
    age: number;
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

export const UserSchema = Joi.object().keys({
  login: Joi.string().required(),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")),
  age: Joi.number().required().integer().min(4).max(130),
});
