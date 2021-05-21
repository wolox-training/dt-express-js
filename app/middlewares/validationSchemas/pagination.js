const { errorMessages } = require('../../constants');

exports.paginationQuerySchema = {
  size: {
    in: 'query',
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: errorMessages.integer
  },
  page: {
    in: 'query',
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: errorMessages.integer
  }
};
