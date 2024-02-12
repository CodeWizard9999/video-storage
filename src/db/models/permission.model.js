const { Model, DataTypes } = require('sequelize');

class Permission extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  id: {
    type: DataTypeSource.INTEGER,
    primaryKey: true
  },
  code: {
    type: DataTypeSource.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypeSource.STRING
  }
});

const permissionModelCreator = (sequelizeConnection) => Permission.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'permission',
  timestamps: false
});

module.exports = {
  permissionModelCreator,
  modelFieldsCreator
};
