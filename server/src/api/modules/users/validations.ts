import Joi from "joi";
import { RegisterBody, LoginBody } from "./types";

export const RegisterValidationSchema = Joi.object<RegisterBody>({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const LoginValidationSchema = Joi.object<LoginBody>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});