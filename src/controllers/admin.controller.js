const { get } = require('lodash');
const dao = require('../dao/orm.dao');
const { BaseError } = require('../services/errors.service');
const { successful } = require('../utils/response.util');
const s3Service = require('../services/s3.service');

const adminController = {
  /**
   * @swagger
   * /vs-admin/user:
   *   get:
   *     summary: Returns list of users for admin request
   *     tags: [Admin]
   *     responses:
   *       200:
   *         description: The list with all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/UserSchema'
   *       404:
   *         description: users not found
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
  getUsers: async (req, res) => {
    const response = await dao.getUsers();
    return successful(res, response);
  },
  /**
   * @swagger
   * /vs-admin/user/{id}:
   *   get:
   *     summary: Returns certain user by id for admin request
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The user id
   *     responses:
   *       200:
   *         description: user by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchema'
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
  getUserById: async (req, res) => {
    const userId = get(req, 'params.id');
    const response = await dao.getUserById(userId);
    return successful(res, response);
  },
  /**
   * @swagger
   * /vs-admin/user/{id}:
   *   patch:
   *     summary: Returns certain updated by id user for admin request
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The user id
   *     responses:
   *       200:
   *         description: updated by id user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchema'
   *       404:
   *         description: role is not exist
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
  updateUserByAdmin: async (req, res) => {
    const { id } = get(req, 'params');
    const newData = get(req, 'body');
    const updatedUser = await dao.updateUserInfo(id, newData);
    return successful(res, updatedUser);
  },
  /**
   * @swagger
   * /vs-admin/user/{id}:
   *   delete:
   *     summary: Returns certain deleted by id user for admin request
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The user id
   *     responses:
   *       200:
   *         description: deleted by id user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/UserSchema'
   *       401:
   *         description: error with deleting videos from s3
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
  deleteUser: async (req, res) => {
    const { id } = get(req, 'params');
    // deleting users videos from s3Bucket
    const deletedUserVideos = await dao.getDeletedUserVideos(id);
    if (deletedUserVideos.length > 0) {
      await Promise.all(deletedUserVideos.map((it) => s3Service.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: get(it, 'key')
      })));
    }
    const deletedUser = await dao.deleteUser(id);

    return successful(res, deletedUser);
  }
};

module.exports = adminController;
