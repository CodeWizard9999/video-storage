const tokenService = require('../services/token.service');
const { InvalidTokenError, MissedTokenError } = require('../services/errors.service');

const getToken = (req) => {
  const cookies = new URLSearchParams(req.cookies);
  const accessTokenFromCookie = cookies.get('accessToken');
  const accessTokenFromHeader = req.header('Authorization')?.split(' ')[1];
  return accessTokenFromCookie || accessTokenFromHeader;
};

module.exports = async (req, res, next) => {
    const accessToken = getToken(req);
    if (!accessToken) throw new MissedTokenError();
    const userData = await tokenService.validateAccessToken(accessToken);
    if (!userData) throw new InvalidTokenError();
    req.user = userData;
    return next();
};
