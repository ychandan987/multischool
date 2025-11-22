// src/middlewares/validate.js

module.exports = function validate(schema, source = "body") {
  return (req, res, next) => {
    const options = {
      abortEarly: false,        // return all errors, not just the first
      allowUnknown: false,      // do not allow unknown fields
      stripUnknown: true,       // remove fields not defined in schema
    };

    const { value, error } = schema.validate(req[source], options);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map(d => d.message),
      });
    }

    // Replace request data with validated + sanitized version
    req[source] = value;
    return next();
  };
};
