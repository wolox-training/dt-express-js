const httpHelper = require('../helpers/http');
const { weet: weetModel } = require('../models');
const { badGatewayError, databaseError } = require('../errors');
const {
  common: {
    services: { weetsBaseUrl }
  }
} = require('../../config');
const logger = require('../logger');

exports.getExternalWeet = () =>
  httpHelper
    .get(weetsBaseUrl, { format: 'json' })
    .then(({ joke }) => joke)
    .catch(error => {
      logger.error(error);

      throw badGatewayError('An error ocurred while trying to get the weet');
    });

exports.createWeet = (userId, content) =>
  weetModel
    .create({ content, userId })
    .then(createdWeet => createdWeet.toJSON())
    .catch(error => {
      logger.error(error);

      throw databaseError('An error ocurred while trying to create weet');
    });
