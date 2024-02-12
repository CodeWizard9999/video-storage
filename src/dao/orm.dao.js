const { Sequelize } = require('sequelize');
const { get, pipe, omit } = require('lodash/fp');
const bcrypt = require('bcrypt');
const { userModelCreator } = require('../db/models/user.model');
const { videoModelCreator } = require('../db/models/video.model');
const { tokenModelCreator } = require('../db/models/token.model');
const { roleModelCreator } = require('../db/models/role.model');
const { permissionModelCreator } = require('../db/models/permission.model');
const { rolePermissionModelCreator } = require('../db/models/role_permissions.model');
const dbConfig = require('../config/database');

const {
  SameUserExistError,
  WrongEmailError,
  WrongPasswordError,
  RefreshTokenNotFoundError,
  UserNotUpdatedError,
  VerificationCodeInvalidError,
  UserNotFoundError,
  VideosNotFoundError,
  VideoIsNotRelatedToThisUserError,
  RoleIsNotExistError,
  PermissionNotFindError,
  AccessDeniedError
} = require('../services/errors.service');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port
});

const UserModel = userModelCreator(sequelize);
const VideoModel = videoModelCreator(sequelize);
const TokenModel = tokenModelCreator(sequelize);
const RoleModel = roleModelCreator(sequelize);
const PermissionModel = permissionModelCreator(sequelize);
const rolePermissionModel = rolePermissionModelCreator(sequelize);

RoleModel.hasOne(UserModel);
PermissionModel.belongsToMany(RoleModel, { through: 'role_permissions', timestamps: false });
RoleModel.belongsToMany(PermissionModel, { through: 'role_permissions', timestamps: false });

UserModel.hasOne(VideoModel, { onDelete: 'cascade' });
VideoModel.belongsTo(UserModel);

UserModel.hasOne(TokenModel, { onDelete: 'cascade' });

const daoResponseTransforming = pipe(
  get('dataValues'),
  omit(['confirmCode', 'password'])
);
const daoResponseArrayTransforming = (array) => array.map(daoResponseTransforming);

const ormDao = {
  connect: () => sequelize.sync({ force: true }),

  // videos-operations

  getAllVideos: async (limit, skip) => VideoModel.findAndCountAll({ limit, offset: skip }),

  getAllVideosByUserID: async (id) => {
    const videos = await VideoModel.findAll({
      where: {
        userId: id,
      },
    });

    if (videos.length <= 0) throw new VideosNotFoundError();

    return videos;
  },
  addVideo: async (videoBody) => VideoModel.create(videoBody),

  deleteVideo: async (videoID, userID) => {
    const video = await VideoModel.findByPk(videoID);
    if (!video) throw new VideoIsNotRelatedToThisUserError();

    const { userId, key } = video;

    if (userId === userID) {
      await VideoModel.destroy({ where: { id: videoID } });
      return key;
    }
    throw new VideoIsNotRelatedToThisUserError();
  },

  // user-operations

  registration: async (userData) => {
    const { password, email, login } = userData;
    const hashPassword = await bcrypt.hash(password, 3);
    const existedUser = await UserModel.findOne({ where: { email, login } });

    if (existedUser) throw new SameUserExistError();

    const createdUser = await UserModel.create({ ...userData, password: hashPassword });

    return daoResponseTransforming(createdUser);
  },
  login: async (email, password) => {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new WrongEmailError();

    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) throw new WrongPasswordError();

    return daoResponseTransforming(user);
  },
  logout: async (refreshToken) => {
    const deletedToken = await TokenModel.findOne({
      where: { refreshToken },
    });
    if (!deletedToken) throw new RefreshTokenNotFoundError();
    await TokenModel.destroy({
      where: { refreshToken },
    });
    return deletedToken;
  },
  setConfirmCode: async (id, code) => {
    const updatedUser = await UserModel.update({ confirmCode: code }, {
      returning: true,
      where: {
        id: id,
      },
    });
    if (!updatedUser) return new UserNotUpdatedError();
    return daoResponseTransforming(updatedUser);
  },
  confirmAccount: async (email, code) => {
    const user = await UserModel.findOne({ where: { confirmCode: code, email } });
    if (!user) throw new VerificationCodeInvalidError();

    await user.update({ confirmed: true });
    return daoResponseTransforming(user);
  },
  getRoleIdByRoleName: async (roleName) => {
    const role = await RoleModel.findOne({ where: { name: roleName } });
    if (!role) throw new RoleIsNotExistError();
    return get('id', role);
  },
  defineAccessToPermission: async (roleId, permissionCode) => {
    const permission = await PermissionModel.findOne({ where: { code: permissionCode } });
    if (!permission) throw new PermissionNotFindError();

    const { id: permissionId } = permission;

    const permissionPair = await rolePermissionModel.findOne({ where: { roleId, permissionId } });
    if (!permissionPair) throw new AccessDeniedError();

    return permissionPair;
  },

  // admin-on-user-operations

  getUsers: async () => {
    const users = await UserModel.findAll();

    if (!users.length) throw new UserNotFoundError();

    return daoResponseArrayTransforming(users);
  },
  getUserById: async (id) => {
    const user = await UserModel.findByPk(id);

    if (!user) throw new UserNotFoundError();

    return daoResponseTransforming(user);
  },
  updateUserInfo: async (id, newData) => {
    const updatingUserQuery = async (data) => {
      const user = await UserModel.findByPk(id);

      if (!user) throw new UserNotFoundError();

      const updatedUser = await UserModel.update(data, {
        returning: true,
        plain: true,
        where: { id }
      });

      if (!updatedUser) throw new UserNotUpdatedError();

      return updatedUser;
    };
    if (get('password', newData)) {
      const hashPassword = await bcrypt.hash(get('password', newData), 3);
      const setObj = { ...newData, password: hashPassword };
      const updatedUser = await updatingUserQuery(setObj);

      return daoResponseTransforming(updatedUser[1]);
    }
    const updatedUser = await updatingUserQuery(newData);

    return daoResponseTransforming(updatedUser[1]);
  },
  confirmAccountByAdmin: async (id) => {
    const user = await UserModel.findByPk(id);

    await user.update({ confirmed: true });

    return user;
  },
  deleteUser: async (id) => {
    const responseOfDeletedUser = await UserModel.findByPk(id);
    const deletedUser = await UserModel.destroy({ where: { id } });

    if (!deletedUser) throw new UserNotFoundError();

    return daoResponseTransforming(responseOfDeletedUser);
  },
  getDeletedUserVideos: async (id) => VideoModel.findAll({ where: { userId: id } }),

  // token-operations

  saveToken: async (id, refreshToken) => {
    const TokenForUser = await TokenModel.findOne({ where: { userId: id } });

    if (TokenForUser) {
      return TokenForUser.update({ refreshToken });
    }

    return TokenModel.create({ refreshToken, userId: id });
  },
  getUserDataByRefreshToken: async (refreshToken) => {
    const tokenRow = await TokenModel.findOne({ where: { refreshToken } });

    if (!tokenRow) throw new RefreshTokenNotFoundError();

    const { userId } = tokenRow;
    const userData = await UserModel.findOne({ where: { id: userId } });

    if (!userData) throw new UserNotFoundError();

    return daoResponseTransforming(userData);
  }
};

module.exports = ormDao;
