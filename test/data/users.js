const _ = require('lodash');

exports.createUserRequestBody = {
  first_name: 'Isaac',
  last_name: 'Newton',
  email: 'isaac.newton@wolox.com',
  password: 'iInventedGravity'
};

exports.expectedUserInfo = _.omit(this.createUserRequestBody, 'password');

exports.getSchemaErrorResponse = errors => ({
  internal_code: 'schema_error',
  message: { errors }
});

exports.user = {
  ..._.omit(this.createUserRequestBody, ['fisrt_name', 'last_name']),
  firstName: 'Isaac',
  lastName: 'Newton'
};

exports.signInRequestBody = {
  email: exports.user.email,
  password: exports.user.password
};
