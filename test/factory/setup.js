const { factory } = require('factory-girl');

const { user: userModel } = require('../../app/models');

factory.define('user', userModel, {
  id: factory.sequence('user.id', n => n),
  firstName: 'firstName',
  lastNAme: 'lastName',
  email: factory.sequence('user.email', n => `'email_${n}@wolox.com'`),
  password: 'password'
});
