const { unauthorizedError, forbiddenError, FORBIDDEN } = require('../errors');
const jwtHelper = require('../helpers/jwt');

exports.authUser = (roles = []) => (req, res, next) => {
  const {
    headers: { authorization }
  } = req;

  if (!authorization) throw unauthorizedError('Unauthorized');

  try {
    const token = authorization.replace('bearer ', '');
    const { id, roleCode, email } = jwtHelper.verifyToken(token);

    if (roles.length && !roles.includes(roleCode)) {
      throw forbiddenError("User doesn't have permissions to execute this action");
    }

    req.user = { id, email, roleCode };
  } catch (error) {
    const { internalCode } = error;
    if (internalCode === FORBIDDEN) throw error;

    throw unauthorizedError('An error ocurred while trying to retrieve token info');
  }

  return next();
};
