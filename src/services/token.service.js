const jwt = require('jsonwebtoken');
const { InvalidTokenError } = require('./errors.service');

const tokenService = {
  tokensGenerator: (payload) => {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    return {
      refreshToken,
      accessToken
    };
  },
  validateAccessToken: (accessToken) => {
    try {
      return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return null;
    }
  },
  validateRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new InvalidTokenError();
    }
  }
};

module.exports = tokenService;
