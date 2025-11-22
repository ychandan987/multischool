const Joi = require("joi");

exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});
