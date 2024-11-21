// src/config/validation.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
});
