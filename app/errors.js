const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SCHEMA_ERROR = 'schema_error';
exports.schemaError = message => internalError(message, exports.SCHEMA_ERROR);

exports.BAD_GATEWAY = 'bad_gateway';
exports.badGatewayError = message => internalError(message, exports.BAD_GATEWAY);

exports.NOT_FOUND = 'not_found';
exports.notFoundError = message => internalError(message, exports.NOT_FOUND);

exports.UNAUTHORIZED = 'unauthorized';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED);
