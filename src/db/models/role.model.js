const { Model, DataTypes } = require('sequelize');

class Role extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  id: {
    type: DataTypeSource.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypeSource.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypeSource.STRING
  }
});

const roleModelCreator = (sequelizeConnection) => Role.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'role',
  timestamps: false
});

module.exports = { roleModelCreator, modelFieldsCreator };
