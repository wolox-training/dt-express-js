const { user: userModel, role: roleModel } = require('../models');
const { notFoundError, unauthorizedError } = require('../errors');
const hashHelper = require('../helpers/hash');
const jwtHelper = require('../helpers/jwt');
const {
  pagination: { defaultPaginationSize, defaultPage },
  roles: {
    codes: { admin: adminRoleCode, reg: regRoleCode }
  }
} = require('../constants');
const logger = require('../logger');

exports.createUser = async (userInfo, roleCode = regRoleCode) => {
  const { email } = userInfo;
  const { id: roleId } = (await roleModel.findOne({ where: { code: roleCode } })).toJSON();
  const userInfoWithRole = { ...userInfo, roleId };

  const createdUser = (await userModel.create(userInfoWithRole)).toJSON();

  logger.info('user with email', email, 'successfully created');

  return createdUser;
};

exports.upsertAdmin = async userInfo => {
  const { email } = userInfo;
  const existingUser = await userModel.findOne({ where: { email } });

  if (!existingUser) {
    return exports.createUser(userInfo, adminRoleCode);
  }

  const { id: adminRoleId } = await roleModel.findOne({ where: { code: adminRoleCode } });
  const userInfoWithRole = { ...userInfo, roleId: adminRoleId };

  const [updatedUser] = (
    await userModel.update(userInfoWithRole, {
      where: { email },
      returning: true,
      individualHooks: true
    })
  )[1];

  return updatedUser.toJSON();
};

exports.signIn = async (email, password) => {
  const user = await userModel.findOne({ where: { email }, include: ['role'] });

  if (!user) throw notFoundError(`User with email ${email} not found`);

  const { password: hashedPassword } = user.toJSON();
  const isValidPassword = await hashHelper.comparePassword(password, hashedPassword);

  if (!isValidPassword) throw unauthorizedError('The provided credentials do not match with our records');

  const {
    id,
    role: { code: roleCode }
  } = user;

  const token = jwtHelper.getToken({ id, email, roleCode });

  return { token };
};

exports.getPaginatedUsers = async ({ size = defaultPaginationSize, page = defaultPage }) => {
  const { count, rows } = await userModel.findAndCountAll({ limit: size, offset: page * size });
  const users = rows.map(user => user.toJSON());

  return { count, size, page, users };
};
