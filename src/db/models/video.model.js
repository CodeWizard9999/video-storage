const { DataTypes, Model } = require('sequelize');

class Video extends Model {}

const modelFieldsCreator = (DataTypeSource) => ({
  videoTitle: {
    type: DataTypeSource.STRING,
    allowNull: true,
  },
  videoDescription: {
    type: DataTypeSource.STRING(2000),
    allowNull: true,
  },
  videoUrl: {
    type: DataTypeSource.STRING(2000),
    allowNull: false,
  },
  key: {
    type: DataTypeSource.STRING,
    allowNull: false,
  }
});

const videoModelCreator = (sequelizeConnection) => Video.init(modelFieldsCreator(DataTypes), {
  sequelize: sequelizeConnection,
  modelName: 'video',
  timestamps: false
});

module.exports = { videoModelCreator, modelFieldsCreator };
