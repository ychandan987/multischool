const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 100 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be 7–15 digits",
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),

  roleId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "roleId must be a number",
      "any.required": "roleId is required",
    }),

  canEditStudents: Joi.boolean().optional(),
});

exports.updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  email: Joi.string().trim().lowercase().email().optional(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone must be 7–15 digits",
    }),

  roleId: Joi.number().integer().min(1).optional(),

  canEditStudents: Joi.boolean().optional(),
});

