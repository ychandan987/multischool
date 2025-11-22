const Joi = require('joi');

exports.createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  roleId: Joi.number().integer().required(), // will map to role
  canEditStudents: Joi.boolean().optional()
});

exports.updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  roleId: Joi.number().integer().optional(),
  canEditStudents: Joi.boolean().optional()
});
