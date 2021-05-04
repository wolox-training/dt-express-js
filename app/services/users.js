const { user: userModel } = require('../models');
const { databaseError } = require('../errors');
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
