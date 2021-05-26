const ENVIRONMENT = process.env.NODE_ENV || 'development';

// eslint-disable-next-line global-require
if (ENVIRONMENT !== 'production') require('dotenv').config();

const configFile = `./${ENVIRONMENT}`;

const isObject = variable => variable instanceof Object;

/*
 * Deep immutable copy of source object into tarjet object and returns a new object.
 */
const deepMerge = (target, source) => {
  if (isObject(target) && isObject(source)) {
    return Object.keys(source).reduce(
      (output, key) => ({
        ...output,
        [key]: isObject(source[key]) && key in target ? deepMerge(target[key], source[key]) : source[key]
      }),
      { ...target }
    );
  }
  return target;
};

const config = {
  common: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    api: {
      bodySizeLimit: process.env.API_BODY_SIZE_LIMIT,
      parameterLimit: process.env.API_PARAMETER_LIMIT,
      port: process.env.PORT
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET
    },
    headers: {
      apiDate: process.env.API_DATE || 'X-API-Date',
      packageVersion: process.env.PACKAGE_VERSION || 'X-Package-Version',
      nodeVersion: process.env.NODE_VERSION || 'X-Node-Version'
    },
    services: {
      weetsBaseUrl: process.env.WEETS_BASE_URL
    },
    tokens: {
      tokensSecret: process.env.TOKENS_SECRET,
      tokensExpiration: process.env.TOKENS_EXPIRATION
    },
    email: {
      host: process.env.EMAIL_HOST,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      port: process.env.EMAIL_PORT
    }
  }
};

const customConfig = require(configFile).config;
module.exports = deepMerge(config, customConfig);
