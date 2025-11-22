const Joi = require('joi');
exports.createStudentSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  dob: Joi.date().optional(),
  rollNumber: Joi.string().optional()
});

exports.updateStudentSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  dob: Joi.date().optional(),
  rollNumber: Joi.string().optional()
});
