const Joi = require('joi');
exports.createSchoolSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional()
});
