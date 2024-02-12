module.exports = {
  PORT: process.env.port || 8000,
  COOKIE_REFRESH_TOKEN_SETTINGS: {
    maximumAge: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000,
    httpOnly: process.env.REFRESH_TOKEN_COOKIE_HTTP_ONLY || true
  },
  COOKIE_ACCESS_TOKEN_SETTINGS: {
    maximumAge: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000,
    httpOnly: process.env.ACCESS_TOKEN_COOKIE_HTTP_ONLY || false
  }
};
