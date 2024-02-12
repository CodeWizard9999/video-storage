const { DataTypes, Model } = require('sequelize');

class Token extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  refreshToken: {
    type: DataTypeSource.STRING(5000),
    allowNull: false,
  }
});

const tokenModelCreator = (sequelizeConnection) => Token.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'token',
  timestamps: false
});

module.exports = { tokenModelCreator, modelFieldsCreator };
