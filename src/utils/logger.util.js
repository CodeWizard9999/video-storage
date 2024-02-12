const pino = require('pino')({
  transport: {
    target: 'pino-pretty'
  },
});

const loggerWrapper = (logger = pino) => ({
  info: (...values) => logger.info(...values),
  error: (...values) => logger.error(...values)
});

module.exports = loggerWrapper();
