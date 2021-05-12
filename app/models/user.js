'use strict';

const hashHelper = require('../helpers/hash');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      tableName: 'users',
      underscored: true,
      hooks: {
        beforeCreate: async user => {
          const { password } = user;

          const hashedPassword = await hashHelper.getHashedPassword(password);
          // eslint-disable-next-line require-atomic-updates
          user.password = hashedPassword;
        }
      }
    }
  );

  return User;
};
