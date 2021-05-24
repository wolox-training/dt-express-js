const weetsService = require('../services/weets');
const weetsSerializer = require('../serializers/weets');

exports.createWeet = async ({ user: { id: userId } }, res, next) => {
  try {
    const weetContent = await weetsService.getExternalWeet();
    const createdWeet = await weetsService.createWeet(userId, weetContent);

    return res.status(201).send(weetsSerializer.serializeWeet(createdWeet));
  } catch (error) {
    return next(error);
  }
};

exports.getWeets = ({ query }, res, next) =>
  weetsService
    .getPaginatedWeets(query)
    .then(({ weets, count, page, size }) => {
      const serializedWeets = weetsSerializer.serializeWeets(weets);

      return res.send({ weets: serializedWeets, count, page, size });
    })
    .catch(next);
