const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.UNAUTHORIZED]: 401,
  [errors.FORBIDDEN]: 403,
  [errors.NOT_FOUND]: 404,
  [errors.SCHEMA_ERROR]: 422,
  [errors.DEFAULT_ERROR]: 500,
  [errors.BAD_GATEWAY]: 502,
  [errors.DATABASE_ERROR]: 503
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
