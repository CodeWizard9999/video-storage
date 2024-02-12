module.exports = {
  username: process.env.DB_USER_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};
