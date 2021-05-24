'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          onDelete: 'cascade'
        }
      },
      weet_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'weets',
          key: 'id',
          onDelete: 'cascade'
        }
      },
      rating: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }),
  down: queryInterface => queryInterface.dropTable('ratings')
};
