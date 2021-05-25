'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'token_limit_timestamp', {
      allowNull: true,
      type: Sequelize.DATE
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'token_limit_timestamp')
};
