const { Router } = require('restify-router');
const authorizationCheckingMiddleware = require('../midllewares/authorizing-checking.middleware');
const validationPassedDatta = require('../midllewares/joi-validation.middleware');
const { userRegistrationSchema } = require('../schemas/validation.schemas');
const permissionAccessChecking = require('../midllewares/role-checking.middleware');
const adminController = require('../controllers/admin.controller');
const loginController = require('../controllers/login.controller');

const routerInstance = new Router();

routerInstance.group('/vs-admin/user', (route) => {
  route.del('/:id', authorizationCheckingMiddleware, permissionAccessChecking('delete_user'), adminController.deleteUser);
  route.post(
    '/',
    authorizationCheckingMiddleware,
    permissionAccessChecking('create_user'),
    validationPassedDatta(userRegistrationSchema),
    loginController.registration
  );
  route.patch(
    '/:id',
    authorizationCheckingMiddleware,
    permissionAccessChecking('update_user'),
    validationPassedDatta(userRegistrationSchema),
    adminController.updateUserByAdmin
  );
  route.get('/:id', authorizationCheckingMiddleware, permissionAccessChecking('get_user'), adminController.getUserById);
  route.get('/', authorizationCheckingMiddleware, permissionAccessChecking('get_users'), adminController.getUsers);
});

module.exports = routerInstance;
