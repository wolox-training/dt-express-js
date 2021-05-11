const axios = require('axios');

const { badGatewayError } = require('../errors');
const {
  common: {
    services: { weetsBaseUrl }
  }
} = require('../../config');
const logger = require('../logger');

exports.getWeet = () =>
  axios.get(weetsBaseUrl, { params: { format: 'json' } }).catch(error => {
    logger.error(error);

    throw badGatewayError('An error ocurred while trying to get the weet');
  });
