exports.errorMessages = {
  providedAndNotEmpty: 'should be provided and not empty',
  validEmail: 'should be a valid email',
  woloxDomain: 'should belong to wolox domain',
  alreadyInRegisters: 'is already in our registers',
  shortPassword: 'should contain at least 8 characters',
  alphanumeric: 'should be alpha-numeric',
  integer: 'should be integer',
  boolean: 'should be boolean',
  notFound: 'not found in our registers'
};

exports.regExp = {
  woloxEmail: /(\w|\.|-)+@wolox\.(\w{2}|(com(\.\w{2})?))$/i
};

exports.pagination = {
  defaultPaginationSize: 10,
  defaultPage: 0
};

exports.roles = {
  codes: {
    reg: 'reg',
    admin: 'admin'
  }
};

exports.emails = {
  userCreated: {
    subject: 'User successfully signed up',
    message: 'A new user was successfully signed up with this email in Wolox weeter'
  },
  congratulations: {
    subject: 'Congratulations Weeter',
    message:
      'You are one of our most representative weeters, thank you for being part of our family.\n\nKeep weeting'
  }
};

exports.cronExpresions = {
  everyMidnight: '0 0 0 * * *'
};
