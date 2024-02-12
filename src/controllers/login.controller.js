const { get } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { omit } = require('lodash');
const dao = require('../dao/orm.dao');
const tokenService = require('../services/token.service');
const { successful, setCookie, clearCookie } = require('../utils/response.util');
const { sendEmail } = require('../services/email-sending.service');
const { COOKIE_REFRESH_TOKEN_SETTINGS, COOKIE_ACCESS_TOKEN_SETTINGS } = require('../config/common.config');

const loginController = {
  /**
   * @swagger
   * /auth/registration:
   *   post:
   *     summary: Registers new user
   *     tags: [Login]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserPayloadSchema'
   *     responses:
   *       200:
   *         description: created user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchemaWithAccessToken'
   *       403:
   *         description: wrong email or password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       409:
   *         description: same user already exist
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       400:
   *         description: user is not updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   * @swagger
   * '/vs-admin/user':
   *   post:
   *     summary: Registers new user
   *     tags: [Admin]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserPayloadSchema'
   *     responses:
   *       200:
   *         description: created user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchemaWithAccessToken'
   *       403:
   *         description: wrong email or password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       409:
   *         description: same user already exist
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       400:
   *         description: user is not updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   */
  registration: async (req, res) => {
    const receivedUserRegistrationData = get(req, 'body');
    const { roleName } = receivedUserRegistrationData;
    const roleId = await dao.getRoleIdByRoleName(roleName);
    const userRegistrationData = { ...omit(receivedUserRegistrationData, ['roleName']), roleId };
    const verificationCode = uuidv4();

    const userData = await dao.registration(userRegistrationData);

    const { refreshToken, accessToken } = tokenService.tokensGenerator(userData);
    await dao.saveToken(get(userData, 'id'), refreshToken);

    setCookie({ res, key: 'refreshToken', value: refreshToken, options: COOKIE_REFRESH_TOKEN_SETTINGS });
    setCookie({ res, key: 'accessToken', value: accessToken, options: COOKIE_ACCESS_TOKEN_SETTINGS });

    await sendEmail({ sendingData: verificationCode });
    await dao.setConfirmCode(get(userData, 'id'), verificationCode);

    const response = { ...userData, accessToken };

    return successful(res, response);
  },
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Login]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/UserLoginPayloadSchema'
   *     responses:
   *       200:
   *         description: created user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchemaWithAccessToken'
   *       403:
   *         description: wrong email or password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   */
  login: async (req, res) => {
    const { email, password } = get(req, 'body');
    const userData = await dao.login(email, password);
    const { refreshToken, accessToken } = tokenService.tokensGenerator(userData);

    await dao.saveToken(userData.id, refreshToken);

    const response = { ...userData, accessToken };

    setCookie({ res, key: 'refreshToken', value: refreshToken, options: COOKIE_REFRESH_TOKEN_SETTINGS });
    setCookie({ res, key: 'accessToken', value: accessToken, options: COOKIE_ACCESS_TOKEN_SETTINGS });

    return successful(res, response);
  },
  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Login]
   *     responses:
   *       200:
   *         description: user refresh token data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/RefreshTokenSchema'
   *       404:
   *         description: refresh token not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   */
  logout: async (req, res) => {
    const { refreshToken } = get(req, 'cookies');
    const deletedToken = await dao.logout(refreshToken);
    clearCookie(res, 'refreshToken');
    clearCookie(res, 'accessToken');
    return successful(res, deletedToken, 301);
  },
  /**
   * @swagger
   * /auth/activate/{code}:
   *   get:
   *     summary: activate user
   *     tags: [Login]
   *     responses:
   *       200:
   *         description: user refresh token data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchema'
   *       406:
   *         description: invalid verification code
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   */
  confirm: async (req, res) => {
    const { code } = get(req, 'params');
    const { email } = get(req, 'user');
    const userVerification = await dao.confirmAccount(email, code);

    return successful(res, userVerification, 202);
  },
  /**
   * @swagger
   * /auth/refresh:
   *   get:
   *     summary: refresh user access token
   *     tags: [Login]
   *     responses:
   *       200:
   *         description: user access token
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJ0ZXN0TG9naW4yIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiY29uZmlybWVkIjpmYWxzZSwicm9sZUlkIjoyLCJpYXQiOjE2MzkwNTIyODAsImV4cCI6MTYzOTA1NTg4MH0.xtMqrThlJd1_vrUPIoYX4JKxk1251nscTCImeLIuhno
   *       401:
   *         description: invalid refresh token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       404:
   *         description: user not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   *       500:
   *         description: internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/Error'
   */
  refresh: async (req, res) => {
    const { refreshToken } = get(req, 'cookies');
    tokenService.validateRefreshToken(refreshToken);
    const userData = await dao.getUserDataByRefreshToken(refreshToken);
    const { accessToken: response } = tokenService.tokensGenerator(userData);
    await dao.saveToken(userData.id, response);

    setCookie({ res, key: 'refreshToken', value: refreshToken, options: COOKIE_REFRESH_TOKEN_SETTINGS });
    setCookie({ res, key: 'accessToken', value: response, options: COOKIE_ACCESS_TOKEN_SETTINGS });

    return successful(res, response);
  }
};

module.exports = loginController;
