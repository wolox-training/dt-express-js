const _ = require('lodash');

const { User } = require('../schemas');

const returnedUserSchema = { ...User, properties: _.omit(User.properties, 'password') };

module.exports = {
  userCreated: {
    description: 'The created user information',
    content: {
      'application/json': {
        schema: returnedUserSchema
      }
    }
  },
  token: {
    description: 'The created user information',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'thisIsAJsonWebToken'
            }
          }
        }
      }
    }
  },
  paginatedUsers: {
    description: 'The requested users page information',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 2
            },
            size: {
              type: 'integer',
              example: 1
            },
            count: {
              type: 'integer',
              example: 121
            },
            users: {
              type: 'array',
              items: returnedUserSchema
            }
          }
        }
      }
    }
  }
};
