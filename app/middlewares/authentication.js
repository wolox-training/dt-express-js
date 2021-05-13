const { unauthorizedError } = require('../errors');
const jwtHelper = require('../helpers/jwt');

exports.authUser = (req, res, next) => {
  const {
    headers: { authorization }
  } = req;

  if (!authorization) throw unauthorizedError('Unauthorized');

  try {
    const token = authorization.replace('bearer ', '');
    const { id, email } = jwtHelper.verifyToken(token);

    req.user = { id, email };
  } catch (error) {
    throw unauthorizedError('An error ocurred while trying to retrieve token info');
  }

  return next();
};
