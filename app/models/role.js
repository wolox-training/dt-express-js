/* eslint-disable require-atomic-updates */
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'roles',
      underscored: true
    }
  );

  Role.associate = models => {
    Role.hasMany(models.user, {
      foreignKey: 'roleId',
      as: 'users'
    });
  };

  return Role;
};
