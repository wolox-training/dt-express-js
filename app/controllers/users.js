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

exports.signIn = async ({ body: { email, password } }, res, next) => {
  try {
    const tokenInfo = await usersService.signIn(email, password);

    return res.send(tokenInfo);
  } catch (error) {
    return next(error);
  }
};

exports.getUsers = ({ query }, res, next) =>
  usersService
    .getPaginatedUsers(query)
    .then(({ users, count, page, size }) => {
      const serializedUsers = usersSerializer.serializeUsers(users);

      return res.send({ users: serializedUsers, count, page, size });
    })
    .catch(next);

exports.upsertAdmin = ({ body }, res, next) =>
  usersService
    .upsertAdmin(usersMapper.mapUser(body))
    .then(admin => res.send(usersSerializer.serializeUser(admin)))
    .catch(next);

exports.invalidateSessions = (req, res, next) => {
  const {
    user: { id: userId }
  } = req;

  return usersService
    .invalidateSessions(userId)
    .then(() => res.send())
    .catch(next);
};
