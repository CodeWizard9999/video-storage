const dao = require('../dao/orm.dao');

module.exports = (permissionCode) => async (req, res, next) => {
  const { roleId } = req.user;
  await dao.defineAccessToPermission(roleId, permissionCode);
  return next();
};
