module.exports = {
  userId: {
    type: 'integer',
    example: 7
  },
  userEmail: {
    type: 'string',
    example: 'tom.engels@wolox.com.ar'
  },
  userFirstName: {
    type: 'string',
    example: 'Isaac'
  },
  userLastName: {
    type: 'string',
    example: 'Newton'
  },
  userPassword: {
    type: 'string',
    example: 'ThisIsASecurePassword1234'
  },
  timestamp: {
    type: 'string',
    example: '2021-05-05T17:36:44.605Z'
  },
  User: {
    type: 'object',
    properties: {
      first_name: {
        $ref: '#/components/schemas/userFirstName'
      },
      last_name: {
        $ref: '#/components/schemas/userLastName'
      },
      id: {
        $ref: '#/components/schemas/userId'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      },
      created_at: {
        $ref: '#/components/schemas/timestamp'
      },
      updated_at: {
        $ref: '#/components/schemas/timestamp'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
