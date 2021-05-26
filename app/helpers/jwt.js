const jwt = require('jsonwebtoken');

const {
  common: {
    tokens: { tokensSecret, tokensExpiration }
  }
} = require('../../config');

const options = { expiresIn: tokensExpiration };

exports.getToken = payload => jwt.sign(payload, tokensSecret, options);

exports.verifyToken = token => jwt.verify(token, tokensSecret, options);
