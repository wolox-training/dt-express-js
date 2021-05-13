const { user: userModel } = require('../models');
const { databaseError, notFoundError, unauthorizedError } = require('../errors');
const hashHelper = require('../helpers/hash');
const jwtHelper = require('../helpers/jwt');
const {
  pagination: { defaultPaginationSize, defaultPage }
} = require('../constants');
const logger = require('../logger');

exports.createUser = userInfo => {
  const { email } = userInfo;

  const createdUser = userModel
    .create(userInfo)
    .then(({ dataValues: user }) => user)
    .catch(error => {
      logger.error('database error', error);

      throw databaseError('An error ocurred while trying to create user with email', email);
    });

  logger.info('user with email', email, 'successfully created');

  return createdUser;
};

exports.signIn = async (email, password) => {
  const user = await userModel.findOne({ where: { email } });

  if (!user) throw notFoundError(`User with email ${email} not found`);

  const { password: hashedPassword } = user;
  const isValidPassword = await hashHelper.comparePassword(password, hashedPassword);

  if (!isValidPassword) throw unauthorizedError('The provided credentials do not match with our records');

  const { id } = user;

  const token = jwtHelper.getToken({ id, email });

  return { token };
};

exports.getPaginatedUsers = async ({ size = defaultPaginationSize, page = defaultPage }) => {
  const { count, rows } = await userModel.findAndCountAll({ limit: size, offset: page * size });
  const users = rows.map(({ dataValues }) => dataValues);

  return { count, size, page, users };
};
