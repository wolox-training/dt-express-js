const { rating: ratingModel } = require('../models');
const logger = require('../logger');
const { databaseError } = require('../errors');

exports.createRating = ratingInfo =>
  ratingModel
    .upsert(ratingInfo, { returning: true })
    .then(([createdRating]) => createdRating.toJSON())
    .catch(error => {
      logger.error(error);

      throw databaseError('An error ocurred while trying to create rating');
    });
