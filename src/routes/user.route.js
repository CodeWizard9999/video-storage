const { Router } = require('restify-router');
const authorizationCheckingMiddleware = require('../midllewares/authorizing-checking.middleware');
const videoController = require('../controllers/video.controller');

const routerInstance = new Router();

routerInstance.get('/videos', authorizationCheckingMiddleware, videoController.getUserVideosByID);

module.exports = routerInstance;
