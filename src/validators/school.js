const Joi = require("joi");

exports.createSchoolSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "School name is required",
      "string.min": "School name must be at least 2 characters",
      "string.max": "School name must be at most 150 characters",
      "any.required": "School name is required",
    }),

  address: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow(null, "")
    .messages({
      "string.max": "Address cannot exceed 255 characters",
    }),
});
