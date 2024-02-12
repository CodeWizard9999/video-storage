const errorHandler = require('../utils/error-handler.util');
const { failed } = require('../utils/response.util');
const { BaseError, InternalApiError } = require('../services/errors.service');

module.exports = async (req, res, route, err) => {
  if (!(err instanceof BaseError)) {
    const criticalError = new InternalApiError(err.stack);
    await errorHandler.handleError(criticalError);
    return failed({ res, error: { code: criticalError.errorCode }, status: criticalError.status });
  }
  return failed({ res, error: { code: err.errorCode, error: err.error }, status: err.status });
};
