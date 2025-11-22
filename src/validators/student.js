const Joi = require("joi");

exports.createStudentSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be at most 50 characters",
      "any.required": "First name is required",
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .optional()
    .allow("")
    .messages({
      "string.max": "Last name must be at most 50 characters",
    }),

  dob: Joi.date()
    .less("now")
    .optional()
    .messages({
      "date.less": "Date of birth cannot be in the future",
    }),

  rollNumber: Joi.string()
    .trim()
    .max(30)
    .optional()
    .allow("")
    .messages({
      "string.max": "Roll number cannot exceed 30 characters",
    }),
});

exports.updateStudentSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),

  lastName: Joi.string().trim().min(1).max(50).optional().allow(""),

  dob: Joi.date().less("now").optional(),

  rollNumber: Joi.string().trim().max(30).optional().allow(""),
});
