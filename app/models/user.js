/* eslint-disable require-atomic-updates */
'use strict';

const hashHelper = require('../helpers/hash');

const hashPassword = async user => {
  const { password } = user;
  const hashedPassword = await hashHelper.getHashedPassword(password);
  user.password = hashedPassword;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
          onDelete: 'restrict'
        }
      }
    },
    {
      tableName: 'users',
      underscored: true,
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
      }
    }
  );

  User.associate = models => {
    User.belongsTo(models.role, {
      as: 'role',
      onDelete: 'restrict',
      foreignKey: 'roleId'
    });

    User.hasMany(models.weet, {
      foreignKey: 'userId',
      as: 'weets'
    });

    User.belongsToMany(models.weet, {
      through: 'rating'
    });
  };

  return User;
};
