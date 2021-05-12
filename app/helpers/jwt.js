const jwt = require('jsonwebtoken');

const config = require('../../config');

const {
  common: {
    tokens: { tokensSecret, tokensExpiration }
  }
} = config;

exports.getToken = payload => jwt.sign(payload, tokensSecret, { expiresIn: tokensExpiration });
