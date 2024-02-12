module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'editor',
        description: 'editor role'
      }, {
        id: 2,
        name: 'admin',
        description: 'admin role'
      }
    ]);

    await queryInterface.bulkInsert('permissions', [
      {
        id: 1,
        code: 'add_video',
        description: 'allow to add video'
      },
      {
        id: 2,
        code: 'delete_video',
        description: 'allow to delete video'
      },
      {
        id: 3,
        code: 'update_video',
        description: 'allow to delete video'
      },
      {
        id: 4,
        code: 'get_video',
        description: 'allow to delete video'
      },
      {
        id: 5,
        code: 'create_user',
        description: 'allow to create user'
      },
      {
        id: 6,
        code: 'delete_user',
        description: 'allow to delete user'
      },
      {
        id: 7,
        code: 'update_user',
        description: 'allow to update user'
      },
      {
        id: 8,
        code: 'get_user',
        description: 'allow to get user'
      },
      {
        id: 9,
        code: 'get_users',
        description: 'allow to get users'
      },
    ]);

    await queryInterface.bulkInsert('role_permissions', [
      {
        roleId: 1,
        permissionId: 1
      }, {
        roleId: 1,
        permissionId: 2
      },
      {
        roleId: 1,
        permissionId: 3
      },
      {
        roleId: 1,
        permissionId: 4
      },
      {
        roleId: 2,
        permissionId: 1
      }, {
        roleId: 2,
        permissionId: 2
      },
      {
        roleId: 2,
        permissionId: 3
      },
      {
        roleId: 2,
        permissionId: 4
      },
      {
        roleId: 2,
        permissionId: 5
      },
      {
        roleId: 2,
        permissionId: 6
      },
      {
        roleId: 2,
        permissionId: 7
      },
      {
        roleId: 2,
        permissionId: 8
      },
      {
        roleId: 2,
        permissionId: 9
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
