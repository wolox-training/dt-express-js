'use strict';

const hashHelper = require('../../app/helpers/hash');

const firstAdminInfo = {
  first_name: 'admin',
  last_name: 'admin',
  email: 'admin@wolox.com',
  password: 'adminadmin',
  created_at: new Date(),
  updated_at: new Date()
};

module.exports = {
  up: async queryInterface => {
    const roleId = await queryInterface.rawSelect('roles', { code: 'admin' }, 'id');

    return queryInterface.bulkInsert(
      'users',
      [
        {
          ...firstAdminInfo,
          password: await hashHelper.getHashedPassword(firstAdminInfo.password),
          role_id: roleId
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    const { email } = firstAdminInfo;

    return queryInterface.bulkDelete('users', { email }, {});
  }
};
