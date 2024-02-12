const { get, toString } = require('lodash');
const axios = require('axios');
const s3Service = require('../services/s3.service');
const dao = require('../dao/orm.dao');
const { successful } = require('../utils/response.util');
const { VideosNotFoundError } = require('../services/errors.service');
const serializePagination = require('../utils/serialize-pagination.util');

const getVideoBody = ({ body }) => ({
  videoTitle: get(body, 'title'),
  videoDescription: get(body, 'description')
});

const getMetaDataObject = (fileData) => ({
  size: toString(get(fileData, 'size')),
  type: get(fileData, 'type')
});

const VideoController = {
  /**
   * @swagger
   * /video:
   *   get:
   *     parameters:
   *      - in: query
   *        name: page[number]
   *        schema:
   *          type: string
   *          description: The number of page
   *      - in: query
   *        name: page[size]
   *        schema:
   *          type: string
   *          description: Quantity of videos per page
   *     summary: getting all videos
   *     tags: [Videos]
   *     responses:
   *       200:
   *         description: list of videos with pagination or not
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/VideosPaginationSchema'
   *       404:
   *         description: videos not found
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
  getAllVideos: async (req, res) => {
    const {
      limit,
      skip
    } = req.query.pagination;
    const response = await dao.getAllVideos(limit, skip);

    const { count, rows } = response;

    if (!count) throw new VideosNotFoundError();

    const serializedResponse = serializePagination(
      {
        params: {
          ...req.query.pagination,
          total: count
        },
        data: rows
      }
    );
    return successful(res, serializedResponse);
  },
  /**
   * @swagger
   * /user/videos:
   *   get:
   *     summary: getting all videos
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: list of videos for current user
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/VideoSchema'
   *       404:
   *         description: videos not found
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
  getUserVideosByID: async (req, res) => {
    const { id } = get(req, 'user');
    const videos = await dao.getAllVideosByUserID(id);
    return successful(res, videos);
  },
  /**
   * @swagger
   * /video:
   *   post:
   *     summary: upload video
   *     tags: [Videos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/VideoSchema'
   *     responses:
   *       200:
   *         description: added video
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/VideoSchema'
   *       404:
   *         description: videos not found
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
  uploadVideo: async (req, res, next) => {
    const videoBody = getVideoBody(req);
    const callbackUrl = get(req.body, 'callback');
    const { id } = req.user;
    const fileName = req.files.video_file.name;
    const filePath = req.files.video_file.path;
    const fileMetaData = getMetaDataObject(req.files.video_file);
    const { Key } = await s3Service.putObject({ fileName, filePath, metaDataObject: fileMetaData });
    const videoUrl = process.env.S3_BUCKET_BASE_URL + Key;

    const addedVideo = await dao.addVideo({ ...videoBody, videoUrl, userId: id, key: Key });
    // test query to callbackUrl
    try {
      await axios.post(callbackUrl, fileMetaData);
    } catch (error) {
      return next(new Error(error));
    }
    //
    return successful(res, addedVideo);
  },
  /**
   * @swagger
   * /video/{id}:
   *   delete:
   *     summary: delete video
   *     tags: [Videos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The video id
   *     responses:
   *       204:
   *         description: deleted video
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/VideoSchema'
   *       403:
   *         description: videos is not related to this user
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
  deleteVideo: async (req, res) => {
    const { id: userId } = req.user;
    const videoId = req.params.id;
    const videoKey = await dao.deleteVideo(videoId, userId);
    const deletingS3VideoParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: videoKey
    };
    await s3Service.deleteObject(deletingS3VideoParams);
    return successful(res, videoKey, 204);
  }
};

module.exports = VideoController;
