const ratingsService = require('../services/ratings');
const ratingsSerializer = require('../serializers/ratings');

exports.createRating = ({ body: { rating }, params: { weetId }, user: { id: userId } }, res, next) =>
  ratingsService
    .createRating({ userId, weetId, rating })
    .then(createdRating => res.status(201).send(ratingsSerializer.serializeRating(createdRating)))
    .catch(next);
