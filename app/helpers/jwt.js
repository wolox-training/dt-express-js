const jwt = require('jsonwebtoken');

const config = require('../../config');

const {
  common: {
    tokens: { tokensSecret, tokensExpiration }
  }
} = config;

const options = { expiresIn: tokensExpiration };

exports.getToken = payload => jwt.sign(payload, tokensSecret, options);

exports.verifyToken = token => jwt.verify(token, tokensSecret, options);
