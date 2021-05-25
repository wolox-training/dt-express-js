'use strict';

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'rating',
    {
      rating: { type: DataTypes.BOOLEAN, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
          onDelete: 'cascade'
        }
      },
      weetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'weet',
          key: 'id',
          onDelete: 'cascade'
        }
      }
    },
    {
      tableName: 'ratings',
      underscored: true
    }
  );

  Rating.associate = models => {
    Rating.belongsTo(models.user, {
      as: 'user',
      onDelete: 'cascade',
      foreignKey: 'userId'
    });

    Rating.belongsTo(models.weet, {
      as: 'weet',
      onDelete: 'cascade',
      foreignKey: 'weetId'
    });
  };

  return Rating;
};
