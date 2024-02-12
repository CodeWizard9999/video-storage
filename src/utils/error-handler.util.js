const logger = require('./logger.util');
const { sendEmail } = require('../services/email-sending.service');

class ErrorHandlerUtil {
  // eslint-disable-next-line class-methods-use-this
  async handleError(err) {
    logger.error(err);
    await sendEmail({
      sendingData: err.error,
      sendingMessageTemplate: 'occurred new Error on server: '
    });
  }
}

module.exports = new ErrorHandlerUtil();
