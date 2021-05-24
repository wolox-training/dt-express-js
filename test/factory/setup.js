const { factory } = require('factory-girl');

const { user: userModel, role: roleModel, weet: weetModel } = require('../../app/models');

const firstId = 1000;

factory.define('user', userModel, {
  id: factory.sequence('user.id', n => n + firstId),
  firstName: 'firstName',
  lastNAme: 'lastName',
  email: factory.sequence('user.email', n => `'email_${n}@wolox.com'`),
  password: 'password'
});

factory.define('role', roleModel, {
  id: factory.sequence('role.id', n => n + firstId),
  name: factory.sequence('role.name', n => `'role_${n}'`),
  code: factory.sequence('role.code', n => `'code_${n}'`)
});

factory.define('weet', weetModel, {
  id: factory.sequence('weet.id', n => n + firstId),
  content: factory.sequence('weet.content', n => `'joke ${n}'`)
});
