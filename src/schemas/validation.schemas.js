const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  login: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  roleName: Joi.string(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

const userLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

const videoSchema = Joi.object({
  video_file: Joi.any(),
  title: Joi.string()
    .min(3)
    .max(100),
  description: Joi.string()
    .min(3)
    .max(500),
  callback: Joi.string()
});

module.exports = { userRegistrationSchema, userLoginSchema, videoSchema };
