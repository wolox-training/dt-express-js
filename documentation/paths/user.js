module.exports = {
  '/users': {
    get: {
      tags: ['Users'],
      description: 'Get users',
      operationId: 'getUsers',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 0
          },
          required: false
        },
        {
          name: 'size',
          in: 'query',
          schema: {
            type: 'integer',
            default: 10
          },
          required: false
        }
      ],
      responses: {
        200: {
          $ref: '#/components/responses/paginatedUsers'
        }
      }
    },
    post: {
      tags: ['Users'],
      description: 'Create user',
      operationId: 'createUser',
      parameters: [],
      requestBody: {
        $ref: '#/components/requestBodies/createUser'
      },
      responses: {
        200: {
          $ref: '#/components/responses/userCreated'
        },
        400: {
          description: 'Invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'User´s email already exists',
                internal_code: 'invalid_parameters'
              }
            }
          }
        }
      }
    }
  },
  '/users/sessions': {
    post: {
      tags: ['Users'],
      description: 'Gets the token to consume endpoints that need authentication',
      operationId: 'signInUser',
      parameters: [],
      requestBody: {
        $ref: '#/components/requestBodies/signInUser'
      },
      responses: {
        200: {
          $ref: '#/components/responses/token'
        }
      }
    }
  }
};
