'use strict';

module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'weet',
    {
      content: { type: DataTypes.TEXT, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
          onDelete: 'cascade'
        }
      }
    },
    {
      tableName: 'weets',
      underscored: true,
      updatedAt: false
    }
  );

  Weet.associate = models => {
    Weet.belongsTo(models.user, {
      as: 'user',
      onDelete: 'cascade',
      foreignKey: 'userId'
    });
  };

  return Weet;
};
