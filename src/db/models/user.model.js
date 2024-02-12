const { DataTypes, Model } = require('sequelize');

class User extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  login: {
    type: DataTypeSource.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypeSource.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypeSource.STRING,
    allowNull: false
  },
  confirmed: {
    type: DataTypeSource.BOOLEAN,
    defaultValue: false
  },
  confirmCode: {
    type: DataTypeSource.STRING
  }
});

const userModelCreator = (sequelizeConnection) => User.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'user',
  timestamps: false
});

module.exports = { userModelCreator, modelFieldsCreator };
