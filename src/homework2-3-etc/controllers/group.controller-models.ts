import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import * as Joi from "joi";
import { EPermission } from "../domain/group.domain";

export interface IGetGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface ICreateGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    permissions: Array<EPermission>;
  };
}

export interface IUpdateGroupRequestSchema extends ICreateGroupRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface IDeleteGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export interface IAddUsersToGroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
  [ContainerTypes.Body]: {
    ids: Array<string>;
  };
}

export const GroupSchema = Joi.object().keys({
  name: Joi.string().required(),
  permissions: Joi.array()
    .unique()
    .items(Joi.string().valid(...Object.keys(EPermission)))
    .required(),
});

export const IdsSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string()).required(),
});
