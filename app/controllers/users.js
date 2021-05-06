const usersService = require('../services/users');
const usersMapper = require('../mappers/users');
const usersSerializer = require('../serializers/users');

exports.createUser = async ({ body }, res, next) => {
  try {
    const userInfo = usersMapper.mapUser(body);
    const createdUser = await usersService.createUser(userInfo);

    return res.status(201).send(usersSerializer.serializeUser(createdUser));
  } catch (error) {
    return next(error);
  }
};
