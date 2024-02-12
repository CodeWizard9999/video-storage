const { Model, DataTypes } = require('sequelize');

class Role extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  permissionId: {
    type: DataTypeSource.INTEGER,
  },
  roleId: {
    type: DataTypeSource.INTEGER
  }
});

const rolePermissionModelCreator = (sequelizeConnection) => Role.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'role_permissions',
  timestamps: false
});

module.exports = { rolePermissionModelCreator, modelFieldsCreator };
