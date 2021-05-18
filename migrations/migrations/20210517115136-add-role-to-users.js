'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const regRoleId = await queryInterface.rawSelect('roles', { code: 'reg' }, 'id');

    return queryInterface.addColumn('users', 'role_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: regRoleId,
      references: {
        model: 'roles',
        key: 'id',
        onDelete: 'restrict'
      }
    });
  },

  down: queryInterface => queryInterface.removeColumn('users', 'role_id')
};
