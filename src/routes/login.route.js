const { Router } = require('restify-router');
const loginController = require('../controllers/login.controller');
const authorizationCheckingMiddleware = require('../midllewares/authorizing-checking.middleware');
const validationPassedDatta = require('../midllewares/joi-validation.middleware');
const { userRegistrationSchema, userLoginSchema } = require('../schemas/validation.schemas');

const routerInstance = new Router();

routerInstance.post(
  '/registration',
  validationPassedDatta(userRegistrationSchema),
  loginController.registration
);
routerInstance.post('/login', validationPassedDatta(userLoginSchema), loginController.login);
routerInstance.post('/logout', loginController.logout);
routerInstance.get('/activate/:code', authorizationCheckingMiddleware, loginController.confirm);
routerInstance.get('/refresh', loginController.refresh);

module.exports = routerInstance;
