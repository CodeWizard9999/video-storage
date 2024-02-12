const { modelFieldsCreator: permissionModelFields } = require('../models/permission.model');
const { modelFieldsCreator: roleModelFields } = require('../models/role.model');
const { modelFieldsCreator: rolePermissionsModelFields } = require('../models/role_permissions.model');
const { modelFieldsCreator: tokenModelFields } = require('../models/token.model');
const { modelFieldsCreator: userModelFields } = require('../models/user.model');
const { modelFieldsCreator: videoModelFields } = require('../models/video.model');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', roleModelFields(Sequelize));
    await queryInterface.createTable('permissions', permissionModelFields(Sequelize));
    await queryInterface.createTable('role_permissions', rolePermissionsModelFields(Sequelize));
    await queryInterface.createTable('tokens', tokenModelFields(Sequelize));
    await queryInterface.createTable('users', userModelFields(Sequelize));
    await queryInterface.createTable('videos', videoModelFields(Sequelize));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tokens');
    await queryInterface.dropTable('videos');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
  }
};
