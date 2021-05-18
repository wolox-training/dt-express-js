'use strict';

const timestamps = {
  created_at: new Date(),
  updated_at: new Date()
};

const adminRole = {
  ...timestamps,
  name: 'administrator',
  code: 'admin'
};

const regularRole = {
  ...timestamps,
  name: 'regular',
  code: 'reg'
};

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('roles', [adminRole, regularRole], {}),

  down: queryInterface => {
    const codes = [adminRole.code, regularRole.code];

    return queryInterface.bulkDelete('roles', { code: codes }, {});
  }
};
