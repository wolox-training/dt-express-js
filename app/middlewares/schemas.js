const { validationResult, checkSchema } = require('express-validator');
const errors = require('../errors');

exports.validateSchema = schema => [
  checkSchema(schema),
  (req, _, next) => {
    const schemaErrors = validationResult(req);
    return schemaErrors.isEmpty() ? next() : next(errors.schemaError(schemaErrors));
  }
];
