import * as Joi from "joi";

export const UserSchema = Joi.object().keys({
  user: {
    login: Joi.string().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")),
    age: Joi.number().required().integer().min(4).max(130),
  },
});
