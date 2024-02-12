const { ValidationError } = require('../services/errors.service');

module.exports = (schema) => async (body) => {
  const item = await schema.validate(body);
  if (item.error) throw new ValidationError(item.error.message);
};
