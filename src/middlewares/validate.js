// src/middlewares/validate.js
module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source]);
  if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(', ') });
  req[source] = value;
  next();
};
