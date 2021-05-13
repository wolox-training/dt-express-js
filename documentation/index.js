const config = require('../config');
const schemas = require('./schemas');
const requestBodies = require('./requestBodies');
const responses = require('./responses');
const paths = require('./paths');
const { version } = require('../package.json');

const port = config.common.api.port || 8080;

module.exports = {
  openapi: '3.0.1',
  info: {
    version,
    title: 'WTraining',
    description: 'WTraining',
    termsOfService: '',
    contact: {
      name: 'Wolox',
      email: 'tls@wolox.com.ar',
      url: 'https://www.wolox.com.ar/'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${port}/`,
      description: 'Local server'
    },
    {
      url: 'https://api_url_testing',
      description: 'Testing server'
    }
  ],
  security: [{ bearerAuth: [] }],
  tags: [
    {
      name: 'Users',
      description: 'Operations related to users, such as create users, get users, get user token, etc'
    }
  ],
  paths,
  components: {
    requestBodies,
    responses,
    schemas,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};
