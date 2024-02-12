const { Router } = require('restify-router');
const videoController = require('../controllers/video.controller');
const authorizationCheckingMiddleware = require('../midllewares/authorizing-checking.middleware');
const validationPassedDatta = require('../midllewares/joi-validation.middleware');
const permissionAccessChecking = require('../midllewares/role-checking.middleware');
const filterFileMiddleware = require('../midllewares/filter-file.middleware');
const definePagination = require('../midllewares/define-pagination.middleware');
const { videoSchema } = require('../schemas/validation.schemas');

const routerInstance = new Router();

routerInstance.group('/video', (route) => {
  route.post(
    '/',
    authorizationCheckingMiddleware,
    validationPassedDatta(videoSchema),
    filterFileMiddleware,
    videoController.uploadVideo
  );
  route.get('/', definePagination, videoController.getAllVideos);
  route.del('/:id', authorizationCheckingMiddleware, permissionAccessChecking('add_video'), videoController.deleteVideo);
});

module.exports = routerInstance;
