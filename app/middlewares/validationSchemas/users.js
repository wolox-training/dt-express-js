const { user: UserModel } = require('../../models');
const { errorMessages, regExp } = require('../../constants');

exports.createUserSchema = {
  first_name: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.providedAndNotEmpty
  },
  last_name: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.providedAndNotEmpty
  },
  email: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.providedAndNotEmpty,
    bail: true,
    isEmail: {
      errorMessage: errorMessages.validEmail,
      bail: true
    },
    matches: {
      options: regExp.woloxEmail,
      errorMessage: errorMessages.woloxDomain,
      bail: true
    },
    custom: {
      options: email =>
        UserModel.findOne({ where: { email } }).then(user => {
          if (user) throw new Error(errorMessages.alreadyInRegisters);
        })
    }
  },
  password: {
    in: 'body',
    optional: false,
    notEmpty: true,
    bail: true,
    errorMessage: errorMessages.providedAndNotEmpty,
    isLength: {
      options: { min: 8 },
      errorMessage: errorMessages.shortPassword
    },
    isAlphanumeric: {
      errorMessage: errorMessages.alphanumeric
    }
  }
};
