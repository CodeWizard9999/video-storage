const { asyncMap } = require('./async.util');
/**
 * Return function with ready validation functions.
 * @param {Array} validationFunctions
 * @returns {function}
 */
const composeValidation = (...validationFunctions) => async (data) => asyncMap(
  async (validator) => validator(data)
)(validationFunctions);

module.exports = {
  composeValidation
};
