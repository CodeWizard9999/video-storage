const { map } = require('lodash/fp');

const { composeValidation } = require('../utils/compose-validations.util');
const createJoiValidator = require('../utils/joi.utils');

const { ValidationArrayOfErrors } = require('../services/errors.service');

module.exports = (...schemas) => {
  const validateWithJoi = composeValidation(
    ...map((schema) => createJoiValidator(schema), schemas)
  );

  return async (req, res, next) => {
    const errors = await validateWithJoi(req.body);

    const isNotValid = errors.find((it) => it);

    if (isNotValid) return next(new ValidationArrayOfErrors(errors));

    return next();
  };
};
