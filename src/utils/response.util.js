const logger = require('./logger.util');

const successful = (res, data, status = 200) => {
  logger.info(status);
  res.status(status);
  return res.json(data);
};

const setCookie = ({ res, key, value, options }) => res.setCookie(key, value, options);

const clearCookie = (res, key) => res.clearCookie(key);

const failed = ({
  res,
  error,
  status = 400
}) => {
  res.status(status);
  return res.json(error);
};

module.exports = {
  successful,
  failed,
  setCookie,
  clearCookie
};
