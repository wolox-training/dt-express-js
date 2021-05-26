const { unauthorizedError, forbiddenError, FORBIDDEN } = require('../errors');
const jwtHelper = require('../helpers/jwt');
const timeHelper = require('../helpers/time');
const { user: UserModel } = require('../models');

exports.authUser = (roles = []) => (req, res, next) => {
  const {
    headers: { authorization }
  } = req;

  if (!authorization) throw unauthorizedError('Unauthorized');

  const token = authorization.replace('bearer ', '');

  let id = 0;
  let roleCode = '';
  let email = '';
  let tokenCreatedAt = '';

  try {
    ({ id, roleCode, email, tokenCreatedAt } = jwtHelper.verifyToken(token));

    if (roles.length && !roles.includes(roleCode)) {
      throw forbiddenError("User doesn't have permissions to execute this action");
    }
  } catch (error) {
    const { internalCode } = error;
    if (internalCode === FORBIDDEN) throw error;

    throw unauthorizedError('An error ocurred while trying to retrieve token info');
  }

  return UserModel.findOne({ where: { id }, raw: true })
    .then(({ tokenLimitTimestamp }) => {
      if (tokenLimitTimestamp && timeHelper.isGreater(tokenLimitTimestamp, tokenCreatedAt)) {
        throw unauthorizedError('This token already expired');
      }

      req.user = { id, email, roleCode };

      return next();
    })
    .catch(next);
};
